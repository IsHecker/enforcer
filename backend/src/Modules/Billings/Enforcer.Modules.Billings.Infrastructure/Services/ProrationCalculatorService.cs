namespace Enforcer.Modules.Billings.Infrastructure.Services;

internal static class ProrationCalculatorService
{
    public static (long Amount, int DaysRemaining) CalculateProrated(
        long fullPrice,
        string billingPeriod,
        DateTime expiresAt,
        DateTime now)
    {
        var remainingDays = CalculateDaysRemaining(expiresAt, now);
        var totalDays = (int)Math.Ceiling((GetNextBillingDate(billingPeriod, now)!.Value - now).TotalDays);

        if (remainingDays == 0)
            return (0, 0);

        if (remainingDays == totalDays)
            return (fullPrice, totalDays);

        var dailyRate = (decimal)fullPrice / totalDays;
        var amount = (long)Math.Ceiling(dailyRate * remainingDays);
        return (amount, remainingDays);
    }

    public static int CalculateDaysRemaining(DateTime expiresAt, DateTime now) =>
        (int)Math.Ceiling((expiresAt - now).TotalDays);

    public static DateTime? GetNextBillingDate(string? billingPeriod, DateTime startDate)
    {
        if (string.IsNullOrEmpty(billingPeriod))
            return null;

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