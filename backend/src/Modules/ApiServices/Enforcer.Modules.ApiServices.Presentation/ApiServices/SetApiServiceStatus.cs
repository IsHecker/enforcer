using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.ApiServices.Presentation.ApiServices;

internal sealed class SetApiServiceStatus : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.ApiServices.SetApiServiceStatus, async (Guid apiServiceId, Request request, ISender sender) =>
        {
            var result = await sender.Send(new SetApiServiceStatusCommand(apiServiceId, request.Status));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .WithTags(Tags.ApiServices);
    }

    internal sealed record Request(string Status);
}