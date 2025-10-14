namespace Enforcer.Modules.ApiServices.Contracts.Usages;

public sealed record QuotaUsageResponse(
    Guid QuotaUsageId,
    Guid SubscriptionId,
    Guid ApiServiceId,
    int QuotasLeft,
    DateTime ResetAt)
{
    public int QuotasLeft { get; set; } = QuotasLeft;
    public DateTime ResetAt { get; set; } = ResetAt;
}