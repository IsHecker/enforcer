namespace Enforcer.Common.Application.Caching;

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);

    Task SetAsync<T>(
        string key,
        T value,
        TimeSpan? expiration = null,
        bool markWriteBack = false,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(string key, CancellationToken cancellationToken = default);

    Task<List<object>> GetPendingWriteBacksByPrefixAsync(params string[] keyPrefixes);
}