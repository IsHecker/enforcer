using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.DeleteEndpoint;

public readonly record struct DeleteEndpointCommand(Guid EndpointId) : ICommand;