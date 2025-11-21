namespace Enforcer.Modules.Analytics.Contracts;

public sealed record SubscriptionStatResponse(
    Guid Id,
    Guid SubscriptionId,
    long TotalApiCalls,
    long ApiCallsUsedThisMonth
);