using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.DeleteEndpoint;

public record DeleteEndpointCommand(Guid EndpointId) : ICommand;