using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Extensions;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.Plans;

internal sealed class CreatePlan : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Plans.Create, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new CreatePlanCommand(
                apiServiceId,
                Guid.Parse("3FA85F64-5717-4562-B3FC-2C963F66AFA6"),
                request.PlanType,
                request.Name,
                request.Price, request.BillingPeriod,
                request.QuotaLimit,
                request.QuotaResetPeriod,
                request.RateLimit,
                request.RateLimitWindow,
                request.Features,
                request.OveragePrice,
                request.MaxOverage,
                request.TierLevel
            ));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .WithTags(Tags.Plans)
        .Produces<Guid>(StatusCodes.Status200OK)
        .WithOpenApiName(nameof(CreatePlan));
    }

    internal readonly record struct Request(
        string PlanType,
        string Name,
        long Price,
        string? BillingPeriod,
        int QuotaLimit,
        string QuotaResetPeriod,
        int RateLimit,
        string RateLimitWindow,
        IEnumerable<string> Features,
        int? OveragePrice,
        int? MaxOverage,
        int TierLevel
    );
}