using Enforcer.Common.Application.Extensions;
using Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using FluentValidation;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.ListApiServices;

internal sealed class ListApiServicesValidator : AbstractValidator<SetApiServiceStatusCommand>
{
    public ListApiServicesValidator()
    {
        RuleFor(x => x.Status).MustBeEnumValue<SetApiServiceStatusCommand, ServiceStatus>();
    }
}