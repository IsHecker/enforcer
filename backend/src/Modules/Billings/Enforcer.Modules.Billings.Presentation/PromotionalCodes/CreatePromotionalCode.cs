using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PromotionalCodes.CreatePromotionalCode;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PromotionalCodes;

internal sealed class CreatePromotionalCode : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.PromotionalCodes.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreatePromotionalCodeCommand(
                request.Code,
                request.Type,
                request.Value,
                request.MaxUses,
                request.MaxUsesPerUser,
                request.ValidFrom,
                request.ValidUntil,
                SharedData.UserId
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PromotionalCodes)
        .Produces(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreatePromotionalCode));
    }

    internal readonly record struct Request(
        string Code,
        string Type,
        int Value,
        int? MaxUses,
        int? MaxUsesPerUser,
        DateTime ValidFrom,
        DateTime? ValidUntil);
}