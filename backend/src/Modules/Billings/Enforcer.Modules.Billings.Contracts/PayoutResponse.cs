namespace Enforcer.Modules.Billings.Contracts;

public sealed record PayoutResponse(
    string PayoutNumber,
    Guid CreatorId,
    long TotalAmount,
    string Currency,
    string? Description,
    string Status,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    DateTime ScheduledDate,
    DateTime? SentAt,
    string? FailureReason
);