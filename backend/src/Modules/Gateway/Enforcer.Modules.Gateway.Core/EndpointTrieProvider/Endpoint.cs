using Enforcer.Modules.ApiServices.Contracts.Endpoints;

namespace Enforcer.Modules.Gateway.Core.EndpointTrieProvider;

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