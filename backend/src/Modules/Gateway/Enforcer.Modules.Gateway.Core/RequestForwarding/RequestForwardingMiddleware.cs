using System.Diagnostics;
using System.Net;
using Enforcer.Common.Application.EventBus;
using Enforcer.Modules.Gateway.Core.Extensions;
using Enforcer.Modules.Gateway.IntegrationEvents;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Core.RequestForwarding;

public sealed class RequestForwardingMiddleware(RequestDelegate next, IEventBus eventBus)
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

            (responseMessage, TimeSpan elapsed) = await ForwardRequestAsync(context, clientFactory, requestMessage);

            await PublishRequestForwardedIntegrationEvent(
                requestContext.ApiService!.Id,
                requestContext.EndpointConfig!.Id,
                requestContext.Subscription!.Id,
                responseMessage.StatusCode,
                (float)elapsed.TotalMilliseconds);

            requestContext.ServiceOverheadMetrics = new
            {
                milliseconds = elapsed.TotalMilliseconds,
                ticks = elapsed.Ticks
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

    private static async Task<(HttpResponseMessage responseMessage, TimeSpan elapsed)> ForwardRequestAsync(
        HttpContext context,
        IHttpClientFactory clientFactory,
        HttpRequestMessage requestMessage)
    {
        var client = clientFactory.CreateClient();

        Stopwatch serviceStopwatch = Stopwatch.StartNew();

        var responseMessage = await client.SendAsync(
            requestMessage,
            HttpCompletionOption.ResponseHeadersRead,
            context.RequestAborted);

        serviceStopwatch.Stop();

        return (responseMessage, serviceStopwatch.Elapsed);
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

    private Task PublishRequestForwardedIntegrationEvent(
        Guid apiServiceId,
        Guid endpointId,
        Guid subscriptionId,
        HttpStatusCode statusCode,
        float responseTimeMs)
    {
        return eventBus.PublishAsync(
            new RequestForwardedIntegrationEvent(
                Guid.NewGuid(),
                DateTime.UtcNow,
                apiServiceId,
                endpointId,
                subscriptionId,
                statusCode,
                responseTimeMs));
    }
}