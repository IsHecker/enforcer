using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.Gateway.RateLimiting;

internal record struct RateLimitConfig(int RateLimit, RateLimitWindow Window, Guid SourceId);