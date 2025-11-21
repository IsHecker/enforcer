using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Plans;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Plans.UpdatePlan;

internal class UpdatePlanCommandValidator : AbstractValidator<UpdatePlanCommand>
{
    public UpdatePlanCommandValidator()
    {
        RuleFor(x => x.PlanId)
            .NotEmpty().WithMessage("PlanId is required.");

        RuleFor(x => x.PlanType).MustBeEnumValue<UpdatePlanCommand, PlanType>();

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.");

        RuleFor(x => x.PriceInCents)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Price cannot be negative.");

        RuleFor(x => x.BillingPeriod!)
            .MustBeEnumValue<UpdatePlanCommand, BillingPeriod>()
            .When(x => x.BillingPeriod is not null);

        RuleFor(x => x.QuotaLimit)
            .GreaterThan(0);

        RuleFor(x => x.QuotaResetPeriod).MustBeEnumValue<UpdatePlanCommand, QuotaResetPeriod>();

        RuleFor(x => x.RateLimit)
            .GreaterThan(0);

        RuleFor(x => x.RateLimitWindow).MustBeEnumValue<UpdatePlanCommand, RateLimitWindow>();

        RuleFor(x => x.OveragePrice)
            .GreaterThanOrEqualTo(0).When(x => x.OveragePrice.HasValue);

        RuleFor(x => x.MaxOverage)
            .GreaterThanOrEqualTo(0).When(x => x.MaxOverage.HasValue);

        RuleFor(x => x.Features)
            .NotNull().WithMessage("Features are required.")
            .Must(f => f.Any()).WithMessage("At least one feature must be provided.");
    }
}