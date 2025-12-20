using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Payments;

namespace Enforcer.Modules.Billings.Infrastructure.Refunds;

internal sealed class RefundService
{
    public async Task<Result> ProcessRefundAsync(Payment payment)
    {
        return Result.Success;
    }

    internal static class RefundEligibilityPolicy
    {
        private const int GracePeriodDays = 7;

        public static bool IsEligibleForFullRefund(DateTime paymentDate)
        {
            var daysSincePayment = (DateTime.UtcNow - paymentDate).Days;

            return daysSincePayment <= GracePeriodDays;
        }
    }
}