using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.PromotionalCodes.ListPromotionalCodesForPlan;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.PromotionalCodes;

internal sealed class ListPromotionalCodesForPlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.PromotionalCodes.ListByPlan, async (
            Guid planId,
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new ListPromotionalCodesForPlanQuery(
                planId,
                SharedData.UserId,
                pagination));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.PromotionalCodes)
        .Produces<PagedResponse<PromotionalCodeResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListPromotionalCodesForPlan));
    }
}