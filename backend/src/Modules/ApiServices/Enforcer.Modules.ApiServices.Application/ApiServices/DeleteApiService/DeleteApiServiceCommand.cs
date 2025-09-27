using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.DeleteApiService;

public sealed record DeleteApiServiceCommand(Guid ApiServiceId) : ICommand;