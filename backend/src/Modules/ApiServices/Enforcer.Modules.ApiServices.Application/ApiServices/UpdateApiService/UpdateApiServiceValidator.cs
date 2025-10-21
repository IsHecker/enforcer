using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.UpdateApiService;

internal sealed class UpdateApiServiceValidator : AbstractValidator<UpdateApiServiceCommand>
{
    public UpdateApiServiceValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name cannot be empty.")
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(400).WithMessage("Description must not exceed 400 characters.");

        RuleFor(x => x.ServiceKey)
            .NotEmpty().WithMessage("Service Key is required.")
            .Matches("^[a-z0-9]+(-[a-z0-9]+)*$")
            .WithMessage("Service Key must contain only lowercase letters and single hyphens between words.");

        RuleFor(x => x.TargetBaseUrl)
            .NotEmpty().WithMessage("Target URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Target URL must be a valid absolute URI.");

        RuleFor(x => x.LogoUrl)
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _)).When(x => x.LogoUrl is not null)
            .WithMessage("Logo URL is not valid.");

        RuleFor(x => x.Version)
            .NotEmpty()
            .Must(v => Version.TryParse(v, out _))
            .WithMessage(cmd => $"Version '{cmd.Version}' must follow semantic versioning.");

        RuleFor(x => x.Category).MustBeEnumValue<UpdateApiServiceCommand, ApiCategory>();

        RuleFor(x => x.Status).MustBeEnumValue<UpdateApiServiceCommand, ServiceStatus>();
    }
}