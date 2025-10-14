using System.Diagnostics.CodeAnalysis;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.Gateway.EndpointTrieProvider;


public readonly struct RouteSegment
{
    public string Value { get; init; }
    public bool IsParameter { get; init; }
    public bool IsOptional { get; init; }
    public string? ParameterName { get; init; }

    public static RouteSegment Literal(string value) => new()
    {
        Value = value,
        IsParameter = false,
        IsOptional = false,
        ParameterName = null
    };

    public static RouteSegment Parameter(string name, bool isOptional) => new()
    {
        Value = ":param",
        IsParameter = true,
        IsOptional = isOptional,
        ParameterName = name
    };
}

public static class RouteTemplateParser
{
    public static IEnumerable<RouteSegment> Parse(string template)
    {
        if (string.IsNullOrEmpty(template))
            yield break;

        int currentIndex = 0;
        while (TryGetNextSegment(template, ref currentIndex, out var range))
        {
            var part = template.AsSpan()[range.start..range.end];

            if (part[0] == '{' && part[^1] == '}')
            {
                var paramContent = part[1..^1];
                var isOptional = paramContent.EndsWith("?");
                var paramName = isOptional ? paramContent[..^1] : paramContent;

                yield return RouteSegment.Parameter(paramName.ToString(), isOptional);

                continue;
            }

            yield return RouteSegment.Literal(part.ToString());
        }
    }

    private static bool TryGetNextSegment(ReadOnlySpan<char> span, ref int currentIndex, out (int start, int end) range)
    {
        while (currentIndex < span.Length && span[currentIndex] == '/')
            currentIndex++;

        if (currentIndex >= span.Length)
        {
            range = default;
            return false;
        }

        int end = currentIndex;
        while (end < span.Length && span[end] != '/')
            end++;

        range = (currentIndex, end);
        currentIndex = end + 1;
        return true;
    }
}

internal class Endpoint(EndpointResponse configuration)
{
    public List<string>? ParameterNames { get; private set; } = null!;
    public EndpointResponse Configuration { get; init; } = configuration;

    public bool TryAddParameterName(string paramName)
    {
        ParameterNames ??= [];
        ParameterNames.Add(paramName);
        return true;
    }
}

internal class SegmentNode
{
    public const string ParametersSegmentKey = ":param";

    public Dictionary<string, SegmentNode> Children { get; } = [];

    public Dictionary<string, Endpoint> AvailableEndpoints { get; private set; } = null!;

    public bool IsEnd { get; private set; } = false;

    public void AddEndpoint(Endpoint endpoint)
    {
        IsEnd = true;

        AvailableEndpoints ??= [];
        AvailableEndpoints.TryAdd(endpoint.Configuration.HttpMethod, endpoint);
    }
}

public class EndpointTrie
{
    private readonly SegmentNode _root = new();

    public EndpointTrie() { }

    public EndpointTrie(IEnumerable<EndpointResponse> endpointConfigs)
    {
        foreach (var config in endpointConfigs)
        {
            var segments = RouteTemplateParser.Parse(config.PublicPath);

            var endpoint = new Endpoint(config);

            RegisterEndpoint(segments, endpoint);
        }
    }

    private static void ValidateOptionalParameters(List<RouteSegment> segments, string originalPath)
    {
        bool foundOptional = false;

        for (int i = 0; i < segments.Count; i++)
        {
            if (segments[i].IsOptional)
            {
                foundOptional = true;
            }
            else if (foundOptional)
            {
                throw new InvalidOperationException(
                    $"Invalid route template '{originalPath}': Optional parameters must appear at the end of the route. " +
                    $"Found non-optional segment '{segments[i].Value}' after optional parameter.");
            }
        }
    }

    private void RegisterEndpoint(IEnumerable<RouteSegment> segments, Endpoint endpoint)
    {
        var currentNode = _root;
        foreach (var segment in segments)
        {
            var key = segment.IsParameter ? SegmentNode.ParametersSegmentKey : segment.Value;

            if (segment.IsParameter)
                endpoint.TryAddParameterName(segment.ParameterName!);

            if (segment.IsOptional)
                currentNode.AddEndpoint(endpoint);

            if (!currentNode.Children.TryGetValue(key, out var nextNode))
            {
                nextNode = new SegmentNode();
                currentNode.Children.Add(key, nextNode);
            }

            currentNode = nextNode;
        }

        currentNode.AddEndpoint(endpoint);
    }

    public bool TryGetEndpoint(
        string path,
        string httpMethod,
        [NotNullWhen(true)] out EndpointResponse? endpointConfig,
        out Dictionary<string, string>? routeValues)
    {
        endpointConfig = null;
        routeValues = null;

        var pathSegments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);

        ulong valueIndexes = 0;
        var currentSegment = _root;

        for (int i = 0; i < pathSegments.Length; i++)
        {
            var segment = pathSegments[i];

            if (currentSegment.Children.TryGetValue(segment, out var literalSegment))
            {
                currentSegment = literalSegment;
                continue;
            }

            if (currentSegment.Children.TryGetValue(SegmentNode.ParametersSegmentKey, out var paramSegment))
            {
                currentSegment = paramSegment;
                valueIndexes = AddIndex(valueIndexes, i);
                continue;
            }

            return false;
        }

        if (currentSegment.IsEnd &&
            currentSegment.AvailableEndpoints.TryGetValue(httpMethod, out var endpoint))
        {
            endpointConfig = endpoint.Configuration;
            routeValues = BuildRouteValues(endpoint.ParameterNames!, valueIndexes, pathSegments);
            return true;
        }

        return false;
    }

    private static Dictionary<string, string>? BuildRouteValues(
        List<string> parameterNames,
        ulong valueIndexes,
        string[] pathSegments)
    {
        if (parameterNames is null || valueIndexes < 1)
            return null;

        var length = parameterNames.Count;
        var routeValues = new Dictionary<string, string>(length);

        for (int i = length - 1; i >= 0; i--)
        {
            var paramName = parameterNames[i];
            var pathValue = pathSegments[ReadIndex(ref valueIndexes)];
            routeValues[paramName] = pathValue;
        }

        return routeValues;
    }

    public static ulong AddIndex(ulong packed, int index)
    {
        if (index > 99)
            throw new ArgumentOutOfRangeException(nameof(index), "Index must be between 0 and 99.");

        return packed * 100 + (byte)index + 1;
    }

    public static byte ReadIndex(ref ulong packed)
    {
        byte index = (byte)(packed % 100);
        packed /= 100;
        return (byte)(index - 1);
    }
}