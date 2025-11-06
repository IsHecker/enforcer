using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.Gateway.Core.RateLimiting;

internal record struct RateLimitConfig(int RateLimit, RateLimitWindow Window, Guid SourceId);