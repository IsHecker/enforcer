using Enforcer.Common.Application.Caching;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Gateway.Core.RateLimiting;

public sealed class RateLimitService(ICacheService cacheService, ILogger<RateLimitService> logger)
{
    private static readonly TimeSpan TokenBucketExpiration = TimeSpan.FromMinutes(5);

    internal async Task<Result> ConsumeRateLimitTokenAsync(Guid subscriptionId, RateLimitConfig config)
    {
        var tokenBucket = await GetOrCreateBucketAsync(subscriptionId, config);

        logger.LogDebug(
            "RateLimit check for Subscription {SubscriptionId}: {Tokens}/{Capacity} tokens available (RefillRate={RefillRate:F2}/s, Window={Window})",
            subscriptionId, tokenBucket.Tokens, tokenBucket.Capacity, tokenBucket.RefillRate, config.Window);

        RefillTokenBucket(ref tokenBucket);

        if (tokenBucket.Tokens <= 0)
        {
            logger.LogWarning(
                "Rate limit exceeded for Subscription {SubscriptionId}. No tokens remaining (Capacity={Capacity}, Window={Window}).",
                subscriptionId, tokenBucket.Capacity, config.Window);

            return Error.TooManyRequests(description: "Rate limit exceeded. Please try again later.");
        }

        tokenBucket.Tokens--;
        await CacheTokenBucketAsync(subscriptionId, config.SourceId, tokenBucket);

        logger.LogInformation(
            "Token consumed for Subscription {SubscriptionId}. Remaining: {Remaining}/{Capacity}. Next refill ~{NextRefillTime:HH:mm:ss}.",
            subscriptionId, tokenBucket.Tokens, tokenBucket.Capacity, tokenBucket.LastRefillTime.AddSeconds(1 / tokenBucket.RefillRate));

        return Result.Success;
    }

    private async Task<TokenBucket> GetOrCreateBucketAsync(Guid subscriptionId, RateLimitConfig config)
    {
        var cached = await GetFromCacheAsync(subscriptionId, config.SourceId);
        if (cached.HasValue)
            return cached.Value;

        var tokenBucket = new TokenBucket(
            config.RateLimit,
            CalculateRefillRate(config.RateLimit, config.Window));

        logger.LogDebug(
            "Created new token bucket for Subscription {SubscriptionId}, Source {SourceId} (Capacity={Capacity}, RefillRate={RefillRate:F2}/s, Window={Window}).",
            subscriptionId, config.SourceId, config.RateLimit, tokenBucket.RefillRate, config.Window);

        return tokenBucket;
    }

    private void RefillTokenBucket(ref TokenBucket tokenBucket)
    {
        var now = DateTime.UtcNow;
        var elapsedSeconds = (int)(now - tokenBucket.LastRefillTime).TotalSeconds;

        if (elapsedSeconds <= 0)
            return;

        var tokensToAdd = (int)(elapsedSeconds * tokenBucket.RefillRate);

        if (tokensToAdd <= 0)
            return;

        var oldTokens = tokenBucket.Tokens;
        tokenBucket.Tokens = Math.Min(tokenBucket.Tokens + tokensToAdd, tokenBucket.Capacity);
        tokenBucket.AdvanceRefillTime(tokensToAdd);

        if (tokenBucket.Tokens != oldTokens)
        {
            logger.LogInformation(
                "Refilled {TokensAdded} tokens (now {Tokens}/{Capacity}) for a token bucket (RefillRate={RefillRate:F2}/s).",
                tokensToAdd, tokenBucket.Tokens, tokenBucket.Capacity, tokenBucket.RefillRate);
        }
    }

    private static float CalculateRefillRate(int rateLimit, RateLimitWindow window)
        => window switch
        {
            RateLimitWindow.Second => rateLimit,
            RateLimitWindow.Minute => rateLimit / 60f,
            RateLimitWindow.Hour => rateLimit / 3600f,
            _ => throw new NotImplementedException(),
        };

    private async Task<TokenBucket?> GetFromCacheAsync(Guid subscriptionId, Guid sourceId)
        => await cacheService.GetAsync<TokenBucket?>(CacheKeys.RateLimit(subscriptionId, sourceId));

    private async Task CacheTokenBucketAsync(Guid subscriptionId, Guid sourceId, TokenBucket tokenBucket)
            => await cacheService.SetAsync(
                CacheKeys.RateLimit(subscriptionId, sourceId),
                tokenBucket,
                TokenBucketExpiration);

    private record struct TokenBucket(
            int Capacity,
            float RefillRate)
    {
        public int Tokens { get; set; } = Capacity;
        public DateTime LastRefillTime { get; private set; } = DateTime.UtcNow;

        public void AdvanceRefillTime(int tokensAdded)
        {
            var secondsForToken = 1 / RefillRate;
            var seconds = tokensAdded * secondsForToken;
            LastRefillTime = LastRefillTime.AddSeconds(seconds);
        }
    }
}