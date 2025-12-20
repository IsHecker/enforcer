using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Billings.Application.Payouts.ListPayoutsByCreator;
using Enforcer.Modules.Billings.Contracts;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Billings.Presentation.Payouts;

internal sealed class ListPayoutsByCreator : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Payouts.ListByCreator, async (
            [AsParameters] Pagination pagination,
            ISender sender) =>
        {
            var result = await sender.Send(new ListPayoutsByCreatorQuery(SharedData.UserId, pagination));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Payouts)
        .Produces<PagedResponse<PayoutResponse>>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(ListPayoutsByCreator));
    }
}