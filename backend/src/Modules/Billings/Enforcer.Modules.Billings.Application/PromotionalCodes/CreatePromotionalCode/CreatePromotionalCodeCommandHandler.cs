using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.CreatePromotionalCode;

internal sealed class CreatePromotionalCodeCommandHandler(IPromotionalCodeRepository codeRepository)
    : ICommandHandler<CreatePromotionalCodeCommand>
{
    public async Task<Result> Handle(CreatePromotionalCodeCommand request, CancellationToken cancellationToken)
    {
        var isExist = await codeRepository.ExistsAsync(request.Code, cancellationToken);
        if (isExist)
            return PromotionalCodeErrors.AlreadyExists;

        var promoCode = PromotionalCode.Create(
            request.Code,
            request.Type.ToEnum<PromotionalCodeDiscountType>(),
            request.Value,
            request.MaxUses,
            request.MaxUsesPerUser,
            request.ValidFrom,
            request.ValidUntil,
            request.CreatedBy);

        await codeRepository.AddAsync(promoCode, cancellationToken);

        return Result.Success;
    }
}