using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class Endpoint : Entity
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
        if (string.IsNullOrWhiteSpace(publicPath))
            return EndpointErrors.PublicPathEmpty;

        if (string.IsNullOrWhiteSpace(targetPath))
            return EndpointErrors.TargetPathEmpty;

        if (rateLimit is <= 0)
            return EndpointErrors.InvalidRateLimit;

        if (rateLimit is not null && rateLimitWindow is null)
            return EndpointErrors.InvalidRateLimitWindow;


        var endpoint = new Endpoint
        {
            ApiServiceId = apiServiceId,
            PlanId = planId,
            HTTPMethod = httpMethod,
            PublicPath = publicPath,
            TargetPath = targetPath,
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
        if (string.IsNullOrWhiteSpace(publicPath))
            return EndpointErrors.PublicPathEmpty;

        if (string.IsNullOrWhiteSpace(targetPath))
            return EndpointErrors.TargetPathEmpty;

        if (rateLimit is <= 0)
            return EndpointErrors.InvalidRateLimit;

        if (rateLimit is not null && rateLimitWindow is null)
            return EndpointErrors.InvalidRateLimitWindow;

        var activationResult = isActive
            ? Activate()
            : Deactivate();

        if (activationResult.IsFailure)
            return activationResult.Error;

        PlanId = planId;
        HTTPMethod = httpMethod;
        PublicPath = publicPath;
        TargetPath = targetPath;
        RateLimit = rateLimit;
        RateLimitWindow = rateLimitWindow;

        return Result.Success;
    }

    public Result Activate()
    {
        if (IsActive)
            return EndpointErrors.AlreadyActive;

        IsActive = true;
        Raise(new EndpointActivatedEvent(Id));
        return Result.Success;
    }

    public Result Deactivate()
    {
        if (!IsActive)
            return EndpointErrors.AlreadyInactive;

        IsActive = false;
        Raise(new EndpointDeactivatedEvent(Id));
        return Result.Success;
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

    public Result ChangeRoutes(string newPublicPath, string newTargetPath)
    {
        if (string.IsNullOrWhiteSpace(newPublicPath))
            return EndpointErrors.PublicPathEmpty;

        if (string.IsNullOrWhiteSpace(newTargetPath))
            return EndpointErrors.TargetPathEmpty;

        PublicPath = newPublicPath.Trim();
        TargetPath = newTargetPath.Trim();

        Raise(new EndpointRouteChangedEvent(Id, PublicPath, TargetPath));
        return Result.Success;
    }

    public static string NormalizePath(string path) =>
        path.Trim().ToLowerInvariant();
}