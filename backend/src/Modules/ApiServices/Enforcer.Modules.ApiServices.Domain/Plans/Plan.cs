using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.Plans.Events;

namespace Enforcer.Modules.ApiServices.Domain.Plans;

public sealed class Plan : Entity
{
    private const int baseTierLevel = 1;

    public Guid ApiServiceId { get; private set; }
    public Guid CreatorId { get; private set; }
    public PlanType Type { get; private set; }
    public string Name { get; private set; } = null!;
    public long PriceInCents { get; private set; }
    public BillingPeriod? BillingPeriod { get; private set; }
    public int QuotaLimit { get; private set; }
    public QuotaResetPeriod QuotaResetPeriod { get; private set; }
    public int RateLimit { get; private set; }
    public RateLimitWindow RateLimitWindow { get; private set; }
    public Guid FeaturesId { get; private set; }
    public bool IsActive { get; private set; }
    public float? OveragePrice { get; private set; }
    public int? MaxOverage { get; private set; }
    public int TierLevel { get; private set; }
    public bool IsDeleted { get; private set; }

    public PlanFeature Features { get; private set; } = null!;

    private Plan() { }

    public static Result<Plan> Create(
        Guid apiServiceId,
        Guid creatorId,
        PlanType type,
        string name,
        long priceInCents,
        int quotaLimit,
        QuotaResetPeriod quotaResetPeriod,
        int rateLimit,
        RateLimitWindow rateLimitWindow,
        int tierLevel,
        BillingPeriod? billingPeriod = null,
        float? overagePrice = null,
        int? maxOverage = null)
    {
        if (apiServiceId == Guid.Empty)
            return PlanErrors.InvalidApiServiceId;

        if (creatorId == Guid.Empty)
            return PlanErrors.InvalidCreatorId;

        if (string.IsNullOrWhiteSpace(name))
            return PlanErrors.EmptyName;

        if (tierLevel < baseTierLevel)
            return PlanErrors.InvalidTierLevel;

        var plan = new Plan
        {
            ApiServiceId = apiServiceId,
            CreatorId = creatorId,
            Type = type,
            Name = name,
            PriceInCents = priceInCents,
            BillingPeriod = billingPeriod,
            QuotaLimit = quotaLimit,
            QuotaResetPeriod = quotaResetPeriod,
            RateLimit = rateLimit,
            RateLimitWindow = rateLimitWindow,
            FeaturesId = Guid.Empty,
            OveragePrice = overagePrice,
            MaxOverage = maxOverage,
            IsActive = true,
            TierLevel = tierLevel
        };

        plan.Raise(new PlanCreatedEvent(plan.Id, plan.ApiServiceId, plan.CreatorId, plan.Type));

        return plan;
    }

    public static Plan CreateDefaultFreePlan(
        Guid apiServiceId,
        Guid creatorId)
    {
        const PlanType defaultType = PlanType.Free;
        const string defaultName = "Free Tier";

        const int defaultPrice = 0;

        const int defaultQuotaLimit = 10000;
        const QuotaResetPeriod defaultQuotaResetPeriod = QuotaResetPeriod.Monthly;

        const int defaultRateLimit = 100;
        const RateLimitWindow defaultRateLimitWindow = RateLimitWindow.Second;

        return Create(
            apiServiceId,
            creatorId,
            defaultType,
            defaultName,
            defaultPrice,
            defaultQuotaLimit,
            defaultQuotaResetPeriod,
            defaultRateLimit,
            defaultRateLimitWindow,
            baseTierLevel
        ).Value;
    }

    public void Activate()
    {
        if (IsActive)
            return;

        IsActive = true;
    }

    public void Deactivate()
    {
        if (!IsActive)
            return;

        IsActive = false;
    }

    public Result Update(
        PlanType type,
        string name,
        long priceInCents,
        BillingPeriod? billingPeriod,
        int quotaLimit,
        QuotaResetPeriod quotaResetPeriod,
        int rateLimit,
        RateLimitWindow rateLimitWindow,
        bool isActive,
        float? overagePrice,
        int? maxOverage,
        int tierLevel)
    {
        if (tierLevel < baseTierLevel)
            return PlanErrors.InvalidTierLevel;

        if (isActive)
            Activate();
        else
            Deactivate();

        Type = type;
        Name = name;
        PriceInCents = priceInCents;
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

    public bool IsOverageAllowed(int overages)
    {
        return MaxOverage is not null && overages < MaxOverage;
    }
}