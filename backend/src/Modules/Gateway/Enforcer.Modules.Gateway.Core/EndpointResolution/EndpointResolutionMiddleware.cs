using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Gateway.Core.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
namespace Enforcer.Modules.Gateway.Core.EndpointResolution;

public sealed class EndpointResolutionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var requestContext = context.GetRequestContext();
        var method = context.Request.Method;
        var path = requestContext.RequestPath!;
        var targetUrl = requestContext.ApiService!.TargetBaseUrl;
        var queries = context.Request.QueryString.Value!;

        var endpointTrie = requestContext.EndpointTrie!;
        var isExist = endpointTrie.TryGetEndpoint(path, method, out var endpoint, out var routeValues);

        if (!isExist)
        {
            await ErrorResponse(context, Error.NotFound(
                "Endpoint.NotFound",
                $"No endpoint found for the provided path or HTTP method in service '{requestContext.ServiceKey}'."));
            return;
        }

        var resolvedPath = BuildResolvedPath(endpoint!.TargetPath, routeValues!);
        var isValidUrl = Uri.TryCreate(new Uri(targetUrl), resolvedPath + queries, out var requestUrl);

        if (!isValidUrl || requestUrl is null)
        {
            await ErrorResponse(context, Error.Failure(
                "Endpoint.InvalidUrl",
                $"Failed to construct a valid request URL. Base: '{targetUrl}', Path: '{resolvedPath}', Query: '{queries}'."));
            return;
        }

        requestContext.RequestUrl = requestUrl;
        requestContext.EndpointConfig = endpoint;

        await next(context);
    }

    private static int CalculateBufferLength(ReadOnlySpan<char> path, Dictionary<string, string> routeValues)
    {
        if (routeValues is null)
            return 0;

        int bracesCount = routeValues.Count * 2;

        int keysLength = 0;
        int valuesLength = 0;

        foreach (var (key, value) in routeValues)
        {
            keysLength += key.Length;
            valuesLength += value.Length;
        }

        var totalToRemove = keysLength + bracesCount;

        return path.Length + (valuesLength - totalToRemove);
    }

    private static string BuildResolvedPath(string targetPath, Dictionary<string, string> routeValues)
    {
        if (targetPath.IsNullOrEmpty())
            return string.Empty;

        const int maxStackBufferLength = 512;

        var bufferLength = CalculateBufferLength(targetPath, routeValues!);

        if (bufferLength <= 0)
            return targetPath;

        Span<char> buffer = bufferLength <= maxStackBufferLength ? stackalloc char[bufferLength] : new char[bufferLength];

        ReadOnlySpan<char> path = targetPath.AsSpan();
        var length = path.Length;

        int currentIndex = 0;
        int written = 0;

        while (currentIndex < length)
        {
            if (path[currentIndex] != '{')
            {
                buffer[written++] = path[currentIndex++];
                continue;
            }

            int startIndex = currentIndex + 1;
            int keyEndIndex = path[startIndex..].IndexOf('}');

            if (keyEndIndex == -1)
                break;

            var key = path.Slice(startIndex, keyEndIndex).ToString();

            if (routeValues.TryGetValue(key, out var value))
            {
                value.AsSpan().CopyTo(buffer[written..]);
                written += value.Length;
            }

            currentIndex = startIndex + keyEndIndex + 1;
        }

        return new string(buffer[..written]);
    }

    private static async Task ErrorResponse(HttpContext context, Error error)
    {
        var problemResult = ApiResults.Problem(error);
        await problemResult.ExecuteAsync(context);
    }
}