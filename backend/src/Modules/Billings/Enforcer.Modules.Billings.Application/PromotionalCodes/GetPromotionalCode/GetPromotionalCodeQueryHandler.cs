using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.GetPromotionalCode;

internal sealed class GetPromotionalCodeQueryHandler(IPromotionalCodeRepository codeRepository)
    : IQueryHandler<GetPromotionalCodeQuery, PromotionalCodeResponse>
{
    public async Task<Result<PromotionalCodeResponse>> Handle(GetPromotionalCodeQuery request, CancellationToken cancellationToken)
    {
        var promoCode = await codeRepository.GetByCode(request.PromoCode, cancellationToken);
        if (promoCode is null)
            return PromotionalCodeErrors.NotFound(request.PromoCode);

        if (promoCode.PlanId != request.PlanId)
            return PromotionalCodeErrors.NotApplicableToThisPlan;

        return promoCode.ToResponse();
    }
}