using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using Enforcer.Modules.Billings.Domain.PromotionalCodeUsages;

namespace Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;

internal sealed class PromoCodeService(
    IPromotionalCodeRepository codeRepository,
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

        var validationResult = await ValidatePromoCodeAsync(promoCode, consumerId, cancellationToken);
        if (validationResult.IsFailure)
            return validationResult.Error;

        var discountAmount = promoCode.CalculateDiscount(totalAmount);

        await RecordUsageAsync(promoCode, consumerId, discountAmount, cancellationToken);

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
        if (!promotionalCode.IsCurrentlyValid())
            return PromotionalCodeErrors.Expired;

        if (promotionalCode.HasReachedMaxUses())
            return PromotionalCodeErrors.MaxUsesReached;

        if (promotionalCode.MaxUsesPerUser.HasValue)
        {
            var userUsageCount = await codeUsageRepository.GetUserUsageCountAsync(
                promotionalCode.Id,
                consumerId,
                cancellationToken);

            if (promotionalCode.HasExceededPerUserLimit(userUsageCount))
                return PromotionalCodeErrors.MaxUsesPerCustomerReached;
        }

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