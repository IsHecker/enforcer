using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.Billings.Domain.PromotionalCodes;
using FluentValidation;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.CreatePromotionalCode;

public sealed class CreatePromotionalCodeValidator
    : AbstractValidator<CreatePromotionalCodeCommand>
{
    public CreatePromotionalCodeValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty();

        RuleFor(x => x.Type).MustBeEnumValue<CreatePromotionalCodeCommand, PromotionalCodeDiscountType>();

        RuleFor(x => x.MaxUses)
            .GreaterThan(0).WithMessage("MaxUses must be greater than zero.")
            .When(x => x.MaxUses is not null);

        RuleFor(x => x.MaxUsesPerUser)
            .GreaterThan(0).WithMessage("MaxUsesPerUser must be greater than zero.")
            .When(x => x.MaxUsesPerUser is not null);

        RuleFor(x => x.ValidFrom)
        .GreaterThanOrEqualTo(DateTime.UtcNow)
        .WithMessage("ValidFrom must not be in the past.");

        RuleFor(x => x.ValidUntil)
        .GreaterThanOrEqualTo(x => x.ValidFrom)
        .WithMessage("ValidUntil must not be before ValidFrom.");

        RuleFor(x => x.Value)
        .GreaterThan(0)
        .WithMessage("Value must be greater than zero.");
    }
}