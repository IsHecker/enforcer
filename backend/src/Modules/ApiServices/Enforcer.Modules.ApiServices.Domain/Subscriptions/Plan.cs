using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Subscriptions.Events;

namespace Enforcer.Modules.ApiServices.Domain.Subscriptions;

public sealed class Plan : Entity
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
    public bool IsDeleted { get; private set; }

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
        int tierLevel)
    {
        if (apiServiceId == Guid.Empty)
            return PlanErrors.InvalidApiServiceId;

        if (creatorId == Guid.Empty)
            return PlanErrors.InvalidCreatorId;

        if (string.IsNullOrWhiteSpace(name))
            return PlanErrors.EmptyName;

        if (tierLevel < 0)
            return PlanErrors.InvalidTierLevel;

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
            TierLevel = tierLevel
        };

        plan.Raise(new PlanCreatedEvent(plan.Id, plan.ApiServiceId, plan.CreatorId, plan.Type));

        return plan;
    }

    public void Activate()
    {
        if (IsActive)
            return;

        IsActive = true;

        Raise(new PlanActivatedEvent(Id));
    }

    public void Deactivate()
    {
        if (!IsActive)
            return;

        IsActive = false;

        Raise(new PlanDeactivatedEvent(Id));
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
        int? maxOverage,
        int tierLevel)
    {
        if (tierLevel < 1)
            return PlanErrors.InvalidTierLevel;

        if (isActive)
            Activate();
        else
            Deactivate();

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
        TierLevel = tierLevel;

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

    public Result MarkAsDeleted()
    {
        if (IsDeleted)
            return PlanErrors.AlreadyDeleted;

        IsDeleted = true;
        return Result.Success;
    }
}