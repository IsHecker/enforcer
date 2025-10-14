using Enforcer.Common.Domain.Results;
using Enforcer.Common.Presentation.Results;
using Enforcer.Modules.Gateway.EndpointTrieProvider;
using Enforcer.Modules.Gateway.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
namespace Enforcer.Modules.Gateway.EndpointResolution;

public class EndpointResolutionMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var method = context.Request.Method;
        var path = context.GetRequestPath()!;
        var targetUrl = context.GetApiService()!.TargetBaseUrl;
        var queries = context.Request.QueryString.Value!;

        var endpointTrie = context.Features.Get<IEndpointTrieFeature>()!.EndpointTrie;
        var isExist = endpointTrie.TryGetEndpoint(path, method, out var endpoint, out var routeValues);

        if (!isExist)
        {
            await ErrorResponse(context, Error.NotFound(
                "Endpoint.NotFound",
                $"No endpoint found for the provided path or HTTP method in service '{context.GetServiceKey()}'."));
            return;
        }

        var resolvedPath = BuildResolvedPath(endpoint!.TargetPath, routeValues!);
        Uri.TryCreate(new Uri(targetUrl), resolvedPath + queries, out var requestUrl);

        if (requestUrl is null)
            return; // return error

        context.SetRequestUrl(requestUrl);
        context.SetEndpointConfig(endpoint);

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