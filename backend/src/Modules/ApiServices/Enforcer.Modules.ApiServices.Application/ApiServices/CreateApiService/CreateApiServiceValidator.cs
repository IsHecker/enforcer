using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public sealed class CreateApiServiceValidator : AbstractValidator<CreateApiServiceCommand>
{
    public CreateApiServiceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name cannot be empty.")
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(400)
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.ServiceKey)
            .NotEmpty().WithMessage("Service Key is required.")
            .Matches("^[a-z]+(-[a-z]+)*$")
            .WithMessage("Service Key must contain only lowercase letters and single hyphens between words.");

        RuleFor(x => x.TargetBaseUrl)
            .NotEmpty().WithMessage("Target URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Target URL must be a valid absolute URI.");

        RuleFor(x => x.LogoUrl)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _)).When(x => x.LogoUrl is not null)
            .WithMessage("Logo URL is not valid.");

        // !Uri.IsWellFormedUriString(logoUrl, UriKind.Absolute)
    }
}