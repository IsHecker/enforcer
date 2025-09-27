using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Plans.CreatePlan;

public sealed class CreatePlanValidator : AbstractValidator<CreatePlanCommand>
{
    public CreatePlanValidator()
    {
        RuleFor(x => x.ApiServiceId)
            .NotEmpty().WithMessage("ApiServiceId is required.");

        RuleFor(x => x.CreatorId)
            .NotEmpty().WithMessage("CreatorId is required.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Plan name is required.")
            .MaximumLength(100).WithMessage("Plan name must be at most 100 characters.");

        RuleFor(x => x.QuotaLimit)
            .GreaterThan(0).WithMessage("Quota limit must be greater than zero.");

        RuleFor(x => x.RateLimit)
            .GreaterThan(0).WithMessage("Rate limit must be greater than zero.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).When(x => x.Price.HasValue)
            .WithMessage("Price cannot be negative.");

        RuleFor(x => x.OveragePrice)
            .GreaterThanOrEqualTo(0).When(x => x.OveragePrice.HasValue)
            .WithMessage("OveragePrice cannot be negative.");

        RuleFor(x => x.MaxOverage)
            .GreaterThanOrEqualTo(0).When(x => x.MaxOverage.HasValue)
            .WithMessage("MaxOverage cannot be negative.");
    }
}