using System.Text;
using Enforcer.Common.Application.Caching;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Enforcer.Common.Infrastructure.Caching;

internal sealed class CacheService(IDistributedCache cache) : ICacheService
{
    public static readonly HashSet<string> PendingWriteBacks = [];
    private readonly object _lock = new();

    private static readonly JsonSerializerSettings jsonSettings = new()
    {
        TypeNameHandling = TypeNameHandling.All,
        MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead,
        Formatting = Formatting.None,
        ContractResolver = new DefaultContractResolver
        {
            DefaultMembersSearchFlags =
            System.Reflection.BindingFlags.Public |
            System.Reflection.BindingFlags.NonPublic |
            System.Reflection.BindingFlags.Instance
        }
    };


    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        byte[]? bytes = await cache.GetAsync(key, cancellationToken);

        return bytes is null ? default : Deserialize<T>(bytes);
    }

    public Task SetAsync<T>(
        string key,
        T value,
        TimeSpan? expiration = null,
        bool markWriteBack = false,
        CancellationToken cancellationToken = default)
    {
        byte[] bytes = Serialize(value);

        if (markWriteBack)
            MarkForWriteBack(key);

        return cache.SetAsync(key, bytes, CacheOptions.Create(expiration), cancellationToken);
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default) =>
        cache.RemoveAsync(key, cancellationToken);

    public async Task<List<object>> GetPendingWriteBacksByPrefixAsync(params string[] keyPrefixes)
    {
        List<object> items = [];

        foreach (var key in PendingWriteBacks)
        {
            var isExist = keyPrefixes.Any(prefix => key.AsSpan().StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
            if (!isExist)
                continue;

            var item = await GetAsync<object>(key);
            if (item is null)
                continue;

            items.Add(item);
            PendingWriteBacks.Remove(key);
        }

        return items;
    }


    private void MarkForWriteBack(string key)
    {
        lock (_lock)
        {
            PendingWriteBacks.Add(key);
        }
    }

    private static T Deserialize<T>(byte[] bytes)
    {
        var json = Encoding.UTF8.GetString(bytes);
        return JsonConvert.DeserializeObject<T>(json, jsonSettings)!;
    }

    private static byte[] Serialize<T>(T value)
    {
        var json = JsonConvert.SerializeObject(value, jsonSettings);
        return Encoding.UTF8.GetBytes(json);
    }
}