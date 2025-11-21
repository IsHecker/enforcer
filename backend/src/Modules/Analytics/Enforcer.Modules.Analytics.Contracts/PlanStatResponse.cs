namespace Enforcer.Modules.Analytics.Contracts;

public sealed record PlanStatResponse(
    Guid Id,
    Guid PlanId,
    int TotalSubscribers,
    int ActiveSubscribers,
    int CancellationsThisMonth,
    float CancellationPercentage
);