using System.Diagnostics.CodeAnalysis;
using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.Gateway.Core.EndpointTrieProvider;

internal class EndpointTrie
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