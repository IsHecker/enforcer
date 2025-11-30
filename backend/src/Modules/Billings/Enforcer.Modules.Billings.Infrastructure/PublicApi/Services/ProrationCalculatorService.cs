namespace Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;

internal static class ProrationCalculatorService
{
    public static long CalculateProrated(long fullPrice, int totalDays, int remainingDays)
    {
        if (remainingDays <= 0) return 0;
        if (remainingDays >= totalDays) return fullPrice;

        var dailyRate = (decimal)fullPrice / totalDays;
        return (long)Math.Ceiling(dailyRate * remainingDays);
    }
}