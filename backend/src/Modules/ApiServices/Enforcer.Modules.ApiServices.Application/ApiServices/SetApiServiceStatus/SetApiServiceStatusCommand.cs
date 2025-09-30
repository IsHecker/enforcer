using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.SetApiServiceStatus;

public sealed record SetApiServiceStatusCommand(Guid ApiServiceId, string Status) : ICommand;