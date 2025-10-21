using System.Diagnostics;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.RequestForwarding;

public sealed class RequestForwardingMiddleware(RequestDelegate next)
{
    private static readonly HashSet<string> HopByHopHeaders =
    [
        "Connection",
        "Keep-Alive",
        "Proxy-Authenticate",
        "Proxy-Authorization",
        "Te",
        "Trailers",
        "Transfer-Encoding",
        "Upgrade",
        "Host"
    ];

    public async Task InvokeAsync(HttpContext context, IHttpClientFactory clientFactory)
    {
        var requestContext = context.GetRequestContext();
        var requestUrl = requestContext.RequestUrl!;

        HttpRequestMessage? requestMessage = null;
        HttpResponseMessage? responseMessage = null;

        try
        {
            requestMessage = BuildRequestMessage(context, requestUrl);

            var client = clientFactory.CreateClient();

            var serviceStopwatch = Stopwatch.StartNew();

            responseMessage = await client.SendAsync(
                requestMessage,
                HttpCompletionOption.ResponseHeadersRead,
                context.RequestAborted);

            serviceStopwatch.Stop();

            requestContext.ServiceOverhead = new
            {
                milliseconds = serviceStopwatch.Elapsed.TotalMilliseconds,
                ticks = serviceStopwatch.Elapsed.Ticks
            };

            ForwardResponseHeaders(context, responseMessage);

            context.Response.StatusCode = (int)responseMessage.StatusCode;

            await responseMessage.Content.CopyToAsync(context.Response.Body);
        }
        finally
        {
            requestMessage?.Dispose();
            responseMessage?.Dispose();
        }
    }

    private static HttpRequestMessage BuildRequestMessage(HttpContext context, Uri requestUrl)
    {
        StreamContent? content = null;

        if (context.Request.ContentLength > 0 && context.Request.Body.CanRead)
            content = new StreamContent(context.Request.Body);

        var requestMessage = new HttpRequestMessage(new HttpMethod(context.Request.Method), requestUrl)
        {
            Content = content
        };

        ForwardRequestHeaders(context, requestMessage, requestUrl.Host);

        return requestMessage;
    }

    private static void ForwardRequestHeaders(HttpContext context, HttpRequestMessage requestMessage, string host)
    {
        foreach (var header in context.Request.Headers)
        {
            if (HopByHopHeaders.Contains(header.Key, StringComparer.OrdinalIgnoreCase))
                continue;

            var headerValue = header.Value.ToString();

            if (!requestMessage.Headers.TryAddWithoutValidation(header.Key, headerValue) &&
                requestMessage.Content != null)
            {
                requestMessage.Content.Headers.TryAddWithoutValidation(header.Key, headerValue);
            }
        }

        requestMessage.Headers.Host = host;
        requestMessage.Headers.ExpectContinue = false;
    }

    private static void ForwardResponseHeaders(HttpContext context, HttpResponseMessage responseMessage)
    {
        foreach (var header in responseMessage.Headers)
        {
            if (!HopByHopHeaders.Contains(header.Key, StringComparer.OrdinalIgnoreCase))
                context.Response.Headers[header.Key] = string.Join(",", header.Value);
        }

        foreach (var header in responseMessage.Content.Headers)
        {
            if (!HopByHopHeaders.Contains(header.Key, StringComparer.OrdinalIgnoreCase))
                context.Response.Headers[header.Key] = string.Join(",", header.Value);
        }
    }
}