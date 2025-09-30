using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.UpdateEndpoint;

public class UpdateEndpointCommandValidator : AbstractValidator<UpdateEndpointCommand>
{
    public UpdateEndpointCommandValidator()
    {
        RuleFor(x => x.EndpointId)
            .NotEmpty().WithMessage("Endpoint ID must be provided.");

        RuleFor(x => x.PublicPath)
            .NotEmpty().WithMessage("Public path cannot be empty.")
            .MaximumLength(200).WithMessage("Public path cannot exceed 200 characters.");

        RuleFor(x => x.TargetPath)
            .NotEmpty().WithMessage("Target path cannot be empty.")
            .MaximumLength(500).WithMessage("Target path cannot exceed 500 characters.");

        RuleFor(x => x.RateLimit)
            .GreaterThan(0).When(x => x.RateLimit.HasValue)
            .WithMessage("Rate limit must be greater than zero.");

        RuleFor(x => x.RateLimitWindow!)
            .MustBeEnumValue<UpdateEndpointCommand, RateLimitWindow>().When(x => x.RateLimit.HasValue)
            .WithMessage("Rate limit window is required when a rate limit is set.");

        RuleFor(x => x.HttpMethod).MustBeEnumValue<UpdateEndpointCommand, HTTPMethod>();
    }
}