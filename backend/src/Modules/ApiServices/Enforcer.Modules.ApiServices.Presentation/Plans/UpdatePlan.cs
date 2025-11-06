using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
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
        app.MapPut(ApiEndpoints.Plans.Update, async (Guid planId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new UpdatePlanCommand(
                planId,
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
                request.MaxOverage,
                request.TierLevel
            ));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.Plans)
        .WithOpenApiName(nameof(UpdatePlan));
    }

    internal readonly record struct Request(
        string PlanType,
        string Name,
        float? Price,
        string? BillingPeriod,
        int QuotaLimit,
        string QuotaResetPeriod,
        int RateLimit,
        string RateLimitWindow,
        IEnumerable<string> Features,
        float? OveragePrice,
        int? MaxOverage,
        int TierLevel,
        bool IsActive
    );
}