using System.Diagnostics;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Gateway.Performance;

public class PerformanceMetricsMiddleware(RequestDelegate next, ILogger<PerformanceMetricsMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var memBefore = GC.GetTotalMemory(false);

        var originalBodyStream = context.Response.Body;
        using var responseBodyStream = new MemoryStream();
        context.Response.Body = responseBodyStream;
        var sw = Stopwatch.StartNew();

        try
        {
            await next(context);

            sw.Stop();
            var memUsed = GC.GetTotalMemory(false) - memBefore;
            var serviceOverhead = context.Items["ServiceOverhead"] as dynamic;
            var middlewareMs = sw.Elapsed.TotalMilliseconds - (serviceOverhead?.milliseconds ?? 0);

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
                serviceOverhead,
                proxyPerformance = new
                {
                    totalMs = sw.Elapsed.TotalMilliseconds,
                    milliseconds = middlewareMs,
                    ticks = sw.Elapsed.Ticks,
                    memoryKB = Math.Round(memUsed / 1024.0, 2)
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

public static class HttpContextExtensions
{
    public static void SetServiceOverhead(this HttpContext context, object overhead)
    {
        context.Items["ServiceOverhead"] = overhead;
    }
}