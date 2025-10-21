using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Plans.DeletePlan;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.DeleteEndpoint;

internal sealed class DeleteEndpointCommandHandler(IEndpointRepository endpointRepository) : ICommandHandler<DeleteEndpointCommand>
{
    public async Task<Result> Handle(DeleteEndpointCommand request, CancellationToken cancellationToken)
    {
        var endpoint = await endpointRepository.GetByIdAsync(request.EndpointId, cancellationToken);
        if (endpoint is null)
            return EndpointErrors.NotFound(request.EndpointId);

        await endpointRepository.DeleteAsync(endpoint, cancellationToken);

        return Result.Success;
    }
}