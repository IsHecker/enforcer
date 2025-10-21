using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public sealed class Endpoint : Entity
{
    public Guid ApiServiceId { get; private set; }
    public Guid PlanId { get; private set; }
    public HTTPMethod HTTPMethod { get; private set; }
    public string PublicPath { get; private set; } = null!;
    public string TargetPath { get; private set; } = null!;
    public int? RateLimit { get; private set; }
    public RateLimitWindow? RateLimitWindow { get; private set; }
    public bool IsActive { get; private set; }

    private Endpoint() { }

    public static Result<Endpoint> Create(
        Guid apiServiceId,
        Guid planId,
        HTTPMethod httpMethod,
        string publicPath,
        string targetPath,
        int? rateLimit,
        RateLimitWindow? rateLimitWindow,
        bool isActive)
    {
        if (rateLimit is <= 0)
            return EndpointErrors.InvalidRateLimit;

        if (rateLimit is not null && rateLimitWindow is null)
            return EndpointErrors.InvalidRateLimitWindow;

        // TODO: validate publicpath and targetpath route patterns and parameters match before saving!

        var endpoint = new Endpoint
        {
            ApiServiceId = apiServiceId,
            PlanId = planId,
            HTTPMethod = httpMethod,
            PublicPath = NormalizePath(publicPath),
            TargetPath = NormalizePath(targetPath),
            RateLimit = rateLimit,
            RateLimitWindow = rateLimitWindow,
            IsActive = isActive
        };

        endpoint.Raise(new EndpointCreatedEvent(endpoint.Id, apiServiceId));

        return endpoint;
    }
    public Result Update(
        Guid planId,
        HTTPMethod httpMethod,
        string publicPath,
        string targetPath,
        int? rateLimit,
        RateLimitWindow? rateLimitWindow,
        bool isActive)
    {
        if (rateLimit is <= 0)
            return EndpointErrors.InvalidRateLimit;

        if (rateLimit is not null && rateLimitWindow is null)
            return EndpointErrors.InvalidRateLimitWindow;

        if (isActive)
            Activate();
        else
            Deactivate();

        PlanId = planId;
        HTTPMethod = httpMethod;
        PublicPath = NormalizePath(publicPath);
        TargetPath = NormalizePath(targetPath);
        RateLimit = rateLimit;
        RateLimitWindow = rateLimitWindow;

        Raise(new EndpointUpdatedEvent(Id, ApiServiceId));

        return Result.Success;
    }

    public void Activate()
    {
        if (IsActive)
            return;

        IsActive = true;
        Raise(new EndpointActivatedEvent(Id));
    }

    public void Deactivate()
    {
        if (!IsActive)
            return;

        IsActive = false;
        Raise(new EndpointDeactivatedEvent(Id));
    }

    public Result ChangeRateLimit(int? rateLimit, RateLimitWindow? window)
    {
        if (rateLimit is <= 0)
            return EndpointErrors.InvalidRateLimit;

        if (rateLimit is not null && window is null)
            return EndpointErrors.InvalidRateLimitWindow;

        RateLimit = rateLimit;
        RateLimitWindow = window;

        Raise(new EndpointRateLimitChangedEvent(Id, rateLimit, window));
        return Result.Success;
    }

    private static string NormalizePath(ReadOnlySpan<char> path)
    {
        const int maxStackLength = 256;
        path = path.Trim().Trim('/');

        Span<char> lowerCase = path.Length <= maxStackLength
            ? stackalloc char[path.Length]
            : new char[path.Length];

        path.ToLowerInvariant(lowerCase);
        return lowerCase.ToString();
    }
}