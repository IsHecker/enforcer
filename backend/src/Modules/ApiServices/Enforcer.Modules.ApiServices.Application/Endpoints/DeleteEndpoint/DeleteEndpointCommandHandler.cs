using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.DeleteEndpoint;

internal sealed class DeleteEndpointCommandHandler(IEndpointRepository endpointRepository) : ICommandHandler<DeleteEndpointCommand>
{
    public async Task<Result> Handle(DeleteEndpointCommand request, CancellationToken cancellationToken)
    {
        var deleteCount = await endpointRepository.DeleteAsync(request.EndpointId, cancellationToken);

        if (deleteCount <= 0)
            return EndpointErrors.NotFound(request.EndpointId);

        return Result.Success;
    }
}