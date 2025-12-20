using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Subscriptions;

internal sealed class CreateSubscription : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Subscriptions.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreateSubscriptionCommand(
                SharedData.UserId,
                request.PlanId,
                request.ApiServiceId,
                request.Code,
                request.ReturnUrl
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Subscriptions)
        .Produces<SessionResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreateSubscription));
    }

    internal readonly record struct Request(
        Guid ApiServiceId,
        Guid PlanId,
        string Code,
        string ReturnUrl
    );
}