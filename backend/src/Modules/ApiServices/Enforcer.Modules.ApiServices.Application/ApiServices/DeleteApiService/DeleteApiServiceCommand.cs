using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.DeleteApiService;

public readonly record struct DeleteApiServiceCommand(Guid ApiServiceId) : ICommand;