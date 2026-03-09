using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PromotionalCodes.DeletePromotionalCode;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PromotionalCodes;

internal sealed class DeletePromotionalCode : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete(ApiEndpoints.PromotionalCodes.Delete, async (Guid promoCodeId, ISender sender) =>
        {
            var result = await sender.Send(new DeletePromotionalCodeCommand(promoCodeId));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.PromotionalCodes)
        .Produces(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(DeletePromotionalCode));
    }
}