using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.CancelSubscription;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class CancelSubscription : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch(ApiEndpoints.Subscriptions.CancelSubscription, async (
            Guid subscriptionId,
            Request request,
            ISender sender) =>
        {
            var result = await sender.Send(new CancelSubscriptionCommand(
                subscriptionId,
                SharedData.UserId,
                request.CancelImmediately));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .WithOpenApiName(nameof(CancelSubscription));
    }

    internal readonly record struct Request(bool CancelImmediately);
}