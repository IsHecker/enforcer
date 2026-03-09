using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.DeletePromotionalCode;

internal sealed class DeletePromotionalCodeCommandHandler(
    IPromotionalCodeRepository codeRepository,
    IPromotionalCodeUsageRepository usageRepository) : ICommandHandler<DeletePromotionalCodeCommand>
{
    public async Task<Result> Handle(DeletePromotionalCodeCommand request, CancellationToken cancellationToken)
    {
        var deleteCount = await codeRepository.DeleteAsync(request.PromoCodeId, cancellationToken);
        if (deleteCount <= 0)
            return PromotionalCodeErrors.NotFound(request.PromoCodeId);

        await DeletePromoCodeUsages(request.PromoCodeId, cancellationToken);

        return Result.Success;
    }

    private async Task DeletePromoCodeUsages(Guid promoCodeId, CancellationToken cancellationToken)
    {
        await usageRepository.DeleteAllByPromoCodeIdAsync(promoCodeId, cancellationToken);
    }
}