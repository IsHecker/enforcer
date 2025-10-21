namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public readonly record struct RouteSegment(string Value, bool IsParameter, bool IsOptional, string? ParameterName)
{
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