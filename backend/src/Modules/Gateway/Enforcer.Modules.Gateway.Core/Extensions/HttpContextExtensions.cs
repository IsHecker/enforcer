using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;
using Enforcer.Modules.ApiServices.Contracts.Subscriptions;
using Enforcer.Modules.Gateway.Core.EndpointTrieProvider;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Modules.Gateway.Core.Extensions;

internal sealed class RequestContext
{
    public ApiServiceResponse? ApiService { get; set; }
    public string? ServiceKey { get; set; }
    public SubscriptionResponse? Subscription { get; set; }
    public EndpointTrie? EndpointTrie { get; set; }
    public EndpointResponse? EndpointConfig { get; set; }
    public string? RequestPath { get; set; }
    public Uri? RequestUrl { get; set; }
    public object? ServiceOverheadMetrics { get; set; }
}

internal static class HttpContextExtensions
{
    public static RequestContext GetRequestContext(this HttpContext context)
    {
        var requestContext = context.Features.Get<RequestContext>();
        if (requestContext == null)
        {
            requestContext = new RequestContext();
            context.Features.Set(requestContext);
        }
        return requestContext;
    }
}