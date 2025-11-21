using Enforcer.Common.Domain.Enums.ApiServices;

namespace Enforcer.Modules.Gateway.Core.RateLimiting;

internal record struct RateLimitConfiguration(int RateLimit, RateLimitWindow Window, Guid SourceId);