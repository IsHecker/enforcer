namespace Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;

internal static class ProrationCalculatorService
{
    public static long CalculateProrated(long fullPrice, string billingPeriod, DateTime expiresAt, DateTime now)
    {
        var remainingDays = CalculateDaysRemaining(expiresAt, now);
        var totalDays = (int)Math.Ceiling((GetNextBillingDate(billingPeriod, now) - now).TotalDays);

        if (remainingDays == 0)
            return 0;

        if (remainingDays == totalDays)
            return fullPrice;

        var dailyRate = (decimal)fullPrice / totalDays;
        return (long)Math.Ceiling(dailyRate * remainingDays);
    }

    public static int CalculateDaysRemaining(DateTime expiresAt, DateTime now) =>
        (int)Math.Ceiling((expiresAt - now).TotalDays);

    // public static int GetBillingPeriodDays(string billingPeriod, DateTime startDate)
    // {
    //     return billingPeriod.ToLowerInvariant() switch
    //     {
    //         "monthly" => (int)Math.Ceiling(
    //             (startDate.AddMonths(1) - startDate).TotalDays),

    //         "yearly" => (int)Math.Ceiling(
    //             (startDate.AddYears(1) - startDate).TotalDays),

    //         _ => throw new ArgumentException(
    //             $"Unknown billing period: {billingPeriod}",
    //             nameof(billingPeriod))
    //     };
    // }

    public static DateTime GetNextBillingDate(string billingPeriod, DateTime startDate)
    {
        return billingPeriod.ToLowerInvariant() switch
        {
            "monthly" => startDate.AddMonths(1),

            "yearly" => startDate.AddYears(1),

            _ => throw new ArgumentException(
                $"Unknown billing period: {billingPeriod}",
                nameof(billingPeriod))
        };
    }
}