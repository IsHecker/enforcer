using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Payouts;

namespace Enforcer.Modules.Billings.Application.Payouts;

public static class PayoutMapper
{
    public static PayoutResponse ToResponse(this Payout payout) =>
        new(
            payout.PayoutNumber,
            payout.CreatorId,
            payout.TotalAmount,
            payout.Currency,
            payout.Description,
            payout.Status.ToString(),
            payout.PeriodStart,
            payout.PeriodEnd,
            payout.ScheduledDate,
            payout.SentAt,
            payout.FailureReason
        );
}