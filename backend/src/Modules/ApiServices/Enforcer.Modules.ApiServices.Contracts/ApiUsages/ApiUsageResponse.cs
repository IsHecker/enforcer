namespace Enforcer.Modules.ApiServices.Contracts.ApiUsages;

public sealed record ApiUsageResponse(
    Guid Id,
    Guid SubscriptionId,
    int QuotasLeft,
    int OverageUsed,
    DateTime ResetAt);