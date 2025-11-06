using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.QuotaUsages.GetSubscriptionQuotaUsage;
using Enforcer.Modules.ApiServices.Contracts.Usages;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.QuotaUsages;

internal sealed class GetSubscriptionQuotaUsage : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.QuotaUsages.GetSubscriptionQuotaUsage, async (Guid subscriptionId, ISender sender) =>
        {
            var result = await sender.Send(new GetSubscriptionQuotaUsageQuery(subscriptionId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.QuotaUsages)
        .Produces<QuotaUsageResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetSubscriptionQuotaUsage));
    }
}