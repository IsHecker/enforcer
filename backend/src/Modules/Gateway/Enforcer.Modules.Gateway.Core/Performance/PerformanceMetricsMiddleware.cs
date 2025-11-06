using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Enforcer.Modules.Gateway.Core.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Core.Performance;

public sealed class PerformanceMetricsMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var memBefore = GC.GetTotalMemory(false);

        var originalBodyStream = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;

        try
        {
            var sw = Stopwatch.StartNew();

            await next(context);

            sw.Stop();
            var memUsed = GC.GetTotalMemory(false) - memBefore;
            var apiServiceOverhead = context.GetRequestContext().ServiceOverheadMetrics as dynamic;
            var apiServiceTimeMs = (float)(apiServiceOverhead?.milliseconds ?? 0f);
            var totalDurationMs = (float)sw.Elapsed.TotalMilliseconds;
            float proxyOverheadMs = totalDurationMs - apiServiceTimeMs;

            var metrics = new
            {
                timestamp = DateTimeOffset.UtcNow,
                request = new
                {
                    method = context.Request.Method,
                    path = context.Request.Path.Value,
                    query = context.Request.QueryString.Value,
                    contentLength = context.Request.ContentLength
                },
                response = new
                {
                    statusCode = context.Response.StatusCode,
                    contentType = context.Response.ContentType
                },
                performance = new
                {
                    // Total time for the entire request through proxy
                    totalDurationMs = float.Round(totalDurationMs, 2),

                    // Time spent in proxy middleware overhead
                    proxyOverheadMs = float.Round(proxyOverheadMs, 2),

                    // Time spent in downstream service (request → response)
                    downstreamApiServiceMs = float.Round(apiServiceTimeMs, 2),

                    totalTicks = sw.Elapsed.Ticks,
                    downstreamServiceTicks = apiServiceOverhead?.ticks ?? 0
                },
                memory = new
                {
                    allocatedKB = float.Round(memUsed / 1024.0f, 2),
                    allocatedBytes = memUsed
                }
            };

            responseBodyStream.Seek(0, SeekOrigin.Begin);
            var originalResponse = await new StreamReader(responseBodyStream).ReadToEndAsync();

            if (context.Response.StatusCode >= 200 && context.Response.StatusCode < 300)
            {
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"\n{'═',80}");
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"✓ RESPONSE BODY");
                Console.ForegroundColor = ConsoleColor.White;
                Console.WriteLine($"   {metrics.request.method} {metrics.request.path} | Status: {metrics.response.statusCode}");
                Console.WriteLine($"   ⏱️  Total: {metrics.performance.totalDurationMs}ms | Downstream: {metrics.performance.downstreamApiServiceMs}ms | Proxy: {metrics.performance.proxyOverheadMs}ms | Memory: {metrics.memory.allocatedKB}KB");
                Console.ForegroundColor = ConsoleColor.Gray;
                Console.WriteLine(string.IsNullOrWhiteSpace(originalResponse) ? "   (empty)" : originalResponse);
                Console.ForegroundColor = ConsoleColor.Cyan;
                Console.WriteLine($"{'═',80}\n");
                Console.ResetColor();
            }

            var canHaveBody = context.Response.StatusCode != 204 &&
                             context.Response.StatusCode != 304 &&
                             context.Response.StatusCode != 205 &&
                             (context.Response.StatusCode < 100 || context.Response.StatusCode >= 200);

            if (canHaveBody)
            {
                var metricsJson = JsonSerializer.Serialize(metrics, new JsonSerializerOptions { WriteIndented = true });
                var metricsBytes = Encoding.UTF8.GetBytes(metricsJson);

                context.Response.ContentType = "application/json";
                context.Response.ContentLength = metricsBytes.Length;
                context.Response.Headers.Remove("Content-Encoding");

                responseBodyStream.SetLength(0);
                responseBodyStream.Seek(0, SeekOrigin.Begin);
                await responseBodyStream.WriteAsync(metricsBytes);
            }

            responseBodyStream.Seek(0, SeekOrigin.Begin);
            await responseBodyStream.CopyToAsync(originalBodyStream);
        }
        finally
        {
            context.Response.Body = originalBodyStream;
        }
    }
}