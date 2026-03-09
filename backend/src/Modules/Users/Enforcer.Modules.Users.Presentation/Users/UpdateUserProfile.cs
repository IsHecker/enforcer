using System.Security.Claims;
using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Users.Application.Users.UpdateUser;
using Enforcer.Common.Infrastructure.Authentication;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Users.Presentation.Users;

internal sealed class UpdateUserProfile : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPut(ApiEndpoints.Users.Profile, async (Request request, ClaimsPrincipal claims, ISender sender) =>
        {
            var result = await sender.Send(new UpdateUserCommand(
                claims.GetUserId(),
                request.FirstName,
                request.LastName));

            return result.MatchResponse(Results.NoContent, ApiResults.Problem);
        })
        .RequireAuthorization(Permissions.ModifyUser)
        .WithTags(Tags.Users);
    }

    internal readonly record struct Request(
        string FirstName,
        string LastName);
}