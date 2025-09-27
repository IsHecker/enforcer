using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.CreateSubscription;

public sealed class CreateSubscriptionCommandValidator
    : AbstractValidator<CreateSubscriptionCommand>
{
    public CreateSubscriptionCommandValidator()
    {
        RuleFor(x => x.ConsumerId).NotEmpty();

        RuleFor(x => x.PlanId).NotEmpty();

        RuleFor(x => x.ApiServiceId).NotEmpty();
    }
}