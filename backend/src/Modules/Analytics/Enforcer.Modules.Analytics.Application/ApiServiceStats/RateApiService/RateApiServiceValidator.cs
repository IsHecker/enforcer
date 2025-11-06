using FluentValidation;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats.RateApiService;

public sealed class RateApiServiceValidator : AbstractValidator<RateApiServiceCommand>
{
    public RateApiServiceValidator()
    {
        RuleFor(x => x.ApiServiceId)
            .NotEmpty().WithMessage("ApiServiceId is required.");

        RuleFor(x => x.Rating)
            .InclusiveBetween((byte)1, (byte)5)
            .WithMessage("Rating must be between 1 and 5.");
    }
}