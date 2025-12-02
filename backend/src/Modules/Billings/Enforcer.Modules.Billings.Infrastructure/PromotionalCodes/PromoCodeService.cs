using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

internal sealed class PromoCodeService(
    PromotionalCodeRepository codeRepository,
    PromotionalCodeUsageRepository codeUsageRepository)
{
    public async Task<Result<InvoiceLineItem>> ApplyPromoCodeAsync(
       string code,
       Guid consumerId,
       long totalAmount,
       CancellationToken cancellationToken = default)
    {
        var promoCode = await codeRepository.GetByCode(code, cancellationToken);
        if (promoCode is null)
            return PromotionalCodeErrors.NotFound(code);

        // Validate code
        var validationResult = await ValidatePromoCodeAsync(promoCode, consumerId, cancellationToken);
        if (validationResult.IsFailure)
            return validationResult.Error;

        // Calculate discount on subtotal
        var discountAmount = promoCode.CalculateDiscount(totalAmount);

        await RecordUsageAsync(promoCode, consumerId, discountAmount, cancellationToken);

        // Add discount as negative line item
        return InvoiceLineItem.Create(
            InvoiceItemType.Discount,
            $"Discount applied '{code}' - ({FormatDiscount(promoCode)})",
            -discountAmount);
    }

    private async Task<Result> ValidatePromoCodeAsync(
        PromotionalCode promotionalCode,
        Guid consumerId,
        CancellationToken cancellationToken = default)
    {
        //Current date is between ValidFrom/ValidUntil
        if (!promotionalCode.IsCurrentlyValid())
            return PromotionalCodeErrors.Expired;

        // MaxTotalUses not exceeded
        if (promotionalCode.HasReachedMaxUses())
            return PromotionalCodeErrors.MaxUsesReached;

        var userUsageCount = await codeUsageRepository.GetUserUsageCountAsync(
            promotionalCode.Id,
            consumerId,
            cancellationToken);

        // User hasn't exceeded MaxUsesPerUser
        if (promotionalCode.HasExceededPerUserLimit(userUsageCount))
            return PromotionalCodeErrors.MaxUsesPerCustomerReached;

        return Result.Success;
    }

    private async Task RecordUsageAsync(
        PromotionalCode promoCode,
        Guid consumerId,
        long appliedDiscount,
        CancellationToken cancellationToken = default)
    {
        var promoCodeUsage = PromotionalCodeUsage.Create(
            promoCode.Id,
            consumerId,
            appliedDiscount);

        await codeUsageRepository.AddAsync(promoCodeUsage, cancellationToken);

        promoCode.IncrementUsageCount();
    }

    private static string FormatDiscount(PromotionalCode promo) =>
        promo.Type == PromotionalCodeDiscountType.Percentage
            ? $"{promo.Value}% off"
            : $"${promo.Value / 100m} off";
}