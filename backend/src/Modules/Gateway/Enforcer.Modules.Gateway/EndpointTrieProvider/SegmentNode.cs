namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

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