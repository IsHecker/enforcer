using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

public class UpdatePlanCommandValidator : AbstractValidator<UpdatePlanCommand>
{
    public UpdatePlanCommandValidator()
    {
        RuleFor(x => x.PlanId)
            .NotEmpty().WithMessage("PlanId is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue);

        RuleFor(x => x.QuotaLimit)
            .GreaterThan(0);

        RuleFor(x => x.RateLimit)
            .GreaterThan(0);

        RuleFor(x => x.OveragePrice)
            .GreaterThanOrEqualTo(0).When(x => x.OveragePrice.HasValue);

        RuleFor(x => x.MaxOverage)
            .GreaterThanOrEqualTo(0).When(x => x.MaxOverage.HasValue);

        RuleFor(x => x.Features)
            .NotNull().WithMessage("Features are required.")
            .Must(f => f.Any()).WithMessage("At least one feature must be provided.");
    }
}