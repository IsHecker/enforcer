using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;

public sealed record SetApiServiceStatusCommand(Guid ApiServiceId, ServiceStatus Status) : ICommand;