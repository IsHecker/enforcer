using System.Security.Claims;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Users.Application.Users.GetUser;
using Enforcer.Common.Infrastructure.Authentication;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Users.Presentation.Users;

internal sealed class GetUserProfile : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(ApiEndpoints.Users.Profile, async (ClaimsPrincipal claims, ISender sender) =>
        {
            var result = await sender.Send(new GetUserQuery(claims.GetUserId()));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .RequireAuthorization(Permissions.GetUser)
        .WithTags(Tags.Users);
    }
}