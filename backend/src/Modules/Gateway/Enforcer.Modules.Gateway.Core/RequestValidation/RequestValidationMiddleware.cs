using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Gateway.Core.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;

namespace Enforcer.Modules.Gateway.Core.RequestValidation;

public sealed class RequestValidationMiddleware(RequestDelegate next)
{
    private const char PathSeparator = '/';
    private const string DefaultRoute = "/";

    public async Task InvokeAsync(HttpContext context, IApiServicesApi servicesApi)
    {
        var path = NormalizePath(context.Request.Path.Value);

        if (!PathValidator.IsValidPath(path))
        {
            await ErrorResponse(context, Error.Validation(
                description: "Invalid characters or structure in URL path."));
            return;
        }

        var (serviceKey, requestPath) = SplitPath(path);

        if (serviceKey.IsNullOrEmpty())
        {
            await ErrorResponse(context, Error.Validation(description: "Service key is missing"));
            return;
        }

        var apiService = await servicesApi.GetApiServiceByServiceKeyAsync(serviceKey);

        if (apiService is null)
        {
            await ErrorResponse(context, Error.NotFound(
                description: $"ApiService with Service Key '{serviceKey}' was not found."));
            return;
        }

        SetContextProperties(context, serviceKey, requestPath, apiService);

        await next(context);
    }

    private static (string serviceKey, string) SplitPath(ReadOnlySpan<char> path)
    {
        int slashIndex = path.IndexOf(PathSeparator);

        if (slashIndex == -1)
            return (path.ToString(), DefaultRoute);

        return (path[..slashIndex].ToString(), path[(slashIndex + 1)..].ToString());
    }

    private static string NormalizePath(string? path)
        => path.AsSpan().Trim(PathSeparator).ToString();

    private static void SetContextProperties(
        HttpContext context,
        string serviceKey,
        string path,
        ApiServiceResponse apiService)
    {
        var requestContext = context.GetRequestContext();
        requestContext.ServiceKey = serviceKey;
        requestContext.RequestPath = path;
        requestContext.ApiService = apiService;
    }

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }
}