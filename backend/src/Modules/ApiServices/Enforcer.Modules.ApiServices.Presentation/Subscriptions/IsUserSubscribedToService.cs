using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.IsUserSubscribedToService;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class IsUserSubscribedToService : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Subscriptions.IsUserSubscribedToService, async (Guid apiServiceId, ISender sender) =>
        {
            var result = await sender.Send(new IsUserSubscribedToServiceQuery(Guid.Empty, apiServiceId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .WithOpenApiName(nameof(IsUserSubscribedToService));
    }
}