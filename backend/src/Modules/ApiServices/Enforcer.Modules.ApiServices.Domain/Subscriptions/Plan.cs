using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public class Plan : Entity
{
    public Guid ApiServiceId { get; private set; }
    public Guid CreatorId { get; private set; }
    public PlanType Type { get; private set; }
    public string Name { get; private set; } = null!;
    public int? Price { get; private set; }
    public BillingPeriod? BillingPeriod { get; private set; }
    public int QuotaLimit { get; private set; }
    public QuotaResetPeriod QuotaResetPeriod { get; private set; }
    public int RateLimit { get; private set; }
    public RateLimitWindow RateLimitWindow { get; private set; }
    public Guid FeaturesId { get; private set; }
    public bool IsActive { get; private set; }
    public int? OveragePrice { get; private set; }
    public int? MaxOverage { get; private set; }
    public int SubscriptionsCount { get; private set; }
    public int TierLevel { get; private set; }

    public PlanFeature Features { get; private set; } = null!;

    private Plan() { }

    public static Result<Plan> Create(
        Guid apiServiceId,
        Guid creatorId,
        PlanType type,
        string name,
        int? price,
        BillingPeriod? billingPeriod,
        int quotaLimit,
        QuotaResetPeriod quotaResetPeriod,
        int rateLimit,
        RateLimitWindow rateLimitWindow,
        int? overagePrice,
        int? maxOverage,
        int sortOrder)
    {
        if (apiServiceId == Guid.Empty)
            return PlanErrors.InvalidApiServiceId;

        if (creatorId == Guid.Empty)
            return PlanErrors.InvalidCreatorId;

        if (string.IsNullOrWhiteSpace(name))
            return PlanErrors.EmptyName;

        if (sortOrder < 0)
            return PlanErrors.InvalidSortOrder;

        var plan = new Plan
        {
            ApiServiceId = apiServiceId,
            CreatorId = creatorId,
            Type = type,
            Name = name,
            Price = price,
            BillingPeriod = billingPeriod,
            QuotaLimit = quotaLimit,
            QuotaResetPeriod = quotaResetPeriod,
            RateLimit = rateLimit,
            RateLimitWindow = rateLimitWindow,
            FeaturesId = Guid.Empty,
            OveragePrice = overagePrice,
            MaxOverage = maxOverage,
            IsActive = true,
            SubscriptionsCount = 0,
            TierLevel = sortOrder
        };

        plan.Raise(new PlanCreatedEvent(plan.Id, plan.ApiServiceId, plan.CreatorId, plan.Type));

        return plan;
    }

    public Result Activate()
    {
        if (IsActive)
            return PlanErrors.AlreadyActive;

        IsActive = true;

        Raise(new PlanActivatedEvent(Id));

        return Result.Success;
    }

    public Result Deactivate()
    {
        if (!IsActive)
            return PlanErrors.AlreadyInactive;

        IsActive = false;

        Raise(new PlanDeactivatedEvent(Id));

        return Result.Success;
    }

    public Result UpdateDetails(
        PlanType type,
        string name,
        int? price,
        BillingPeriod? billingPeriod,
        int quotaLimit,
        QuotaResetPeriod quotaResetPeriod,
        int rateLimit,
        RateLimitWindow rateLimitWindow,
        bool isActive,
        int? overagePrice,
        int? maxOverage)
    {
        var activationResult = isActive
            ? Activate()
            : Deactivate();

        if (activationResult.IsFailure)
            return activationResult.Error;

        Type = type;
        Name = name;
        Price = price;
        BillingPeriod = billingPeriod;
        QuotaLimit = quotaLimit;
        QuotaResetPeriod = quotaResetPeriod;
        RateLimit = rateLimit;
        RateLimitWindow = rateLimitWindow;
        OveragePrice = overagePrice;
        MaxOverage = maxOverage;

        return Result.Success;
    }

    public void IncrementSubscriptions()
    {
        SubscriptionsCount++;
        Raise(new PlanSubscriptionAddedEvent(Id, SubscriptionsCount));
    }

    public Result DecrementSubscriptions()
    {
        if (SubscriptionsCount == 0)
            return PlanErrors.NoSubscriptionsToRemove;

        SubscriptionsCount--;
        Raise(new PlanSubscriptionRemovedEvent(Id, SubscriptionsCount));
        return Result.Success;
    }

    public void SetFeaturesId(Guid featuresId)
    {
        FeaturesId = featuresId;
    }
}