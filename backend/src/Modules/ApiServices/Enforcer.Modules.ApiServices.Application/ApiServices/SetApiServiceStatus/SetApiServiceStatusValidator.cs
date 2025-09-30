using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;

public class SetApiServiceStatusValidator : AbstractValidator<SetApiServiceStatusCommand>
{
    public SetApiServiceStatusValidator()
    {
        RuleFor(x => x.Status).MustBeEnumValue<SetApiServiceStatusCommand, ServiceStatus>();
    }
}