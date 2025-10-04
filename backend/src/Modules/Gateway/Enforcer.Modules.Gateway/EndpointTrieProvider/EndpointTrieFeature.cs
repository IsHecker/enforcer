namespace Enforcer.Modules.Gateway.EndpointTrieProvider;

public interface IEndpointTrieFeature
{
    EndpointTrie? EndpointTrie { get; init; }
}

public record EndpointTrieFeature(EndpointTrie? EndpointTrie) : IEndpointTrieFeature;