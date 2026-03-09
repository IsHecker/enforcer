using Enforcer.Common.Presentation;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Users.Application.Users.RegisterUser;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace Enforcer.Modules.Users.Presentation.Users;

internal sealed class RegisterUser : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(ApiEndpoints.Users.Register, async (Request request, ISender sender) =>
        {
            var result = await sender.Send(new RegisterUserCommand(
                request.Email,
                request.Password,
                request.FirstName,
                request.LastName));

            return result.MatchResponse(Results.Ok, ApiResults.Problem);
        })
        .AllowAnonymous()
        .WithTags(Tags.Users);
    }

    internal readonly record struct Request(
        string Email,
        string Password,
        string FirstName,
        string LastName);
}