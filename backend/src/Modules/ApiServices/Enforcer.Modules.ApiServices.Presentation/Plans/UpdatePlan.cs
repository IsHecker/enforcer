using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Plans;

internal sealed class UpdatePlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.Plans.Create, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new UpdatePlanCommand(
                request.PlanId,
                request.PlanType,
                request.Name,
                request.Price,
                request.BillingPeriod,
                request.QuotaLimit,
                request.QuotaResetPeriod,
                request.RateLimit,
                request.RateLimitWindow,
                request.IsActive,
                request.Features,
                request.OveragePrice,
                request.MaxOverage
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Plans);
    }

    internal sealed record Request(
        Guid PlanId,
        string PlanType,
        string Name,
        int? Price,
        string? BillingPeriod,
        int QuotaLimit,
        string QuotaResetPeriod,
        int RateLimit,
        string RateLimitWindow,
        IEnumerable<string> Features,
        int? OveragePrice,
        int? MaxOverage,
        bool IsActive
    );
}