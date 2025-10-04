using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace Enforcer.Modules.Gateway.RequestValidation;

public class RequestValidationMiddleware(RequestDelegate next)
{
    public Task InvokeAsync(HttpContext context)
    {
        ReadOnlySpan<char> path = context.Request.Path.Value.AsSpan().Trim('/');

        if (!PathValidator.IsValidPath(path))
            return InvalidUrlResponse(context);

        var (serviceKey, route) = SplitPath(path);

        if (serviceKey.IsNullOrEmpty())
            return MissingServiceKeyResponse(context);

        context.SetServiceKey(serviceKey);
        context.SetRoute(route);

        return next(context);
    }

    private static (string serviceKey, string) SplitPath(ReadOnlySpan<char> path)
    {
        int slashIndex = path.IndexOf('/');

        if (slashIndex == -1)
            return (path.ToString(), "/");

        return (path[..slashIndex].ToString(), path[(slashIndex + 1)..].ToString());
    }

    private static Task MissingServiceKeyResponse(HttpContext context)
    {
        IResult problemResult = ApiResults.Problem(Error.Validation("Key.Missing", "Service key is missing"));
        problemResult.ExecuteAsync(context).GetAwaiter().GetResult();
        return Task.CompletedTask;
    }

    private static Task InvalidUrlResponse(HttpContext context)
    {
        IResult result = ApiResults.Problem(
            Error.Validation("Url.Invalid", "Invalid characters or structure in URL path."));

        result.ExecuteAsync(context).GetAwaiter().GetResult();
        return Task.CompletedTask;
    }
}