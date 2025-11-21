using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiUsages.GetSubscriptionApiUsage;
using Enforcer.Modules.ApiServices.Contracts.ApiUsages;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiUsages;

internal sealed class GetSubscriptionApiUsage : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.ApiUsages.GetSubscriptionApiUsage, async (Guid subscriptionId, ISender sender) =>
        {
            var result = await sender.Send(new GetSubscriptionApiUsageQuery(subscriptionId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.ApiUsages)
        .Produces<ApiUsageResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetSubscriptionApiUsage));
    }
}