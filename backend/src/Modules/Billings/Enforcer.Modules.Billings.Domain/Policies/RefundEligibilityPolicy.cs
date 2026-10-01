using Enforcer.Modules.Billings.Domain.Refunds;

namespace Enforcer.Modules.Billings.Domain.Policies;

public static class RefundEligibilityPolicy
{
    private const int GracePeriodDays = 7;

    public static bool IsEligibleForFullRefund(DateTime paymentDate)
    {
        var daysSincePayment = (DateTime.UtcNow - paymentDate).Days;

        return daysSincePayment <= GracePeriodDays;
    }
}
