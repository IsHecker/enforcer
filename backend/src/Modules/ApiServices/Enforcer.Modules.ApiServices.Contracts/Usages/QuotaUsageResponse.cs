namespace Enforcer.Modules.ApiServices.Contracts.Usages;

public sealed record QuotaUsageResponse(
    Guid QuotaUsageId,
    Guid SubscriptionId,
    int QuotasLeft,
    DateTime ResetAt);