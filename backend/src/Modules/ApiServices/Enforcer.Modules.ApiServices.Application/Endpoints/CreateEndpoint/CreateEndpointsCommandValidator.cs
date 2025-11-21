using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Endpoints;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

internal sealed class CreateEndpointsCommandValidator : AbstractValidator<CreateEndpointsCommand>
{
    public CreateEndpointsCommandValidator()
    {
        RuleFor(x => x.ApiServiceId)
            .NotEmpty().WithMessage("API Service Id is required.");

        RuleFor(x => x.Endpoints)
            .NotEmpty().WithMessage("At least one endpoint must be provided.");

        RuleForEach(x => x.Endpoints).SetValidator(new EndpointCreationDataValidator());
    }
}

internal sealed class EndpointCreationDataValidator : AbstractValidator<EndpointCreationData>
{
    public EndpointCreationDataValidator()
    {
        RuleFor(x => x.PlanId)
            .NotEmpty().WithMessage("Plan Id is required.");

        RuleFor(x => x.HttpMethod).MustBeEnumValue<EndpointCreationData, HTTPMethod>();

        RuleFor(x => x.PublicPath)
            .NotEmpty().WithMessage("Public path is required.")
            .MaximumLength(200).WithMessage("Public path must not exceed 200 characters.");

        RuleFor(x => x.TargetPath)
            .NotEmpty().WithMessage("Target path is required.")
            .MaximumLength(200).WithMessage("Target path must not exceed 200 characters.");

        RuleFor(x => x.RateLimit)
            .GreaterThan(0).When(x => x.RateLimit.HasValue)
            .WithMessage("Rate limit must be greater than zero when provided.");

        RuleFor(x => x.RateLimitWindow!)
            .MustBeEnumValue<EndpointCreationData, RateLimitWindow>()
            .When(x => x.RateLimit.HasValue)
            .WithMessage("Rate limit window is required when a rate limit is set.");
    }
}