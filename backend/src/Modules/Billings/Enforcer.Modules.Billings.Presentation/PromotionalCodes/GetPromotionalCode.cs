using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PromotionalCodes.CreatePromotionalCode;
using Enforcer.Modules.Billings.Application.PromotionalCodes.GetPromotionalCode;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PromotionalCodes;

internal sealed class GetPromotionalCode : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.PromotionalCodes.GetByCode, async (string promoCode, Request request, ISender sender) =>
        {
            var result = await sender.Send(new GetPromotionalCodeQuery(promoCode, request.PlanId));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.PromotionalCodes)
        .Produces<PromotionalCodeResponse>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(GetPromotionalCode));
    }

    internal readonly record struct Request(Guid PlanId);
}