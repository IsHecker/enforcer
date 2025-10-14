namespace Enforcer.Common.Application.Caching;

public static class CacheKeys
{
    // <context>:<type>:<identifier>
    public static string QuotaUsage(Guid subscriptionId, Guid serviceId) => $"quota:{subscriptionId}:{serviceId}";
    public static string RateLimit(Guid subscriptionId, string target) => $"ratelimit:{subscriptionId}:{target}";
    public static string EndpointTrie(string serviceKey) => $"endpoint-trie:{serviceKey}";
}