using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.UpdateEndpoint;

internal sealed class UpdateEndpointCommandHandler(IEndpointRepository endpointRepository) : ICommandHandler<UpdateEndpointCommand>
{
    public async Task<Result> Handle(UpdateEndpointCommand request, CancellationToken cancellationToken)
    {
        var endpoint = await endpointRepository.GetByIdAsync(request.EndpointId, cancellationToken);
        if (endpoint is null)
            return EndpointErrors.NotFound(request.EndpointId);

        var httpMethod = request.HttpMethod.ToEnum<HTTPMethod>();

        if (request.PublicPath != endpoint.PublicPath)
        {
            var isRouteExist = await endpointRepository.IsRouteExistsAsync(
            endpoint.ApiServiceId,
            httpMethod,
            request.PublicPath,
            cancellationToken);

            if (isRouteExist)
                return EndpointErrors.DuplicateRoute;
        }

        var updateResult = endpoint.Update(
            request.PlanId,
            httpMethod,
            request.PublicPath,
            request.TargetPath,
            request.RateLimit,
            request.RateLimitWindow?.ToEnum<RateLimitWindow>(),
            request.IsActive);

        if (updateResult.IsFailure)
            return updateResult.Error;

        await endpointRepository.UpdateAsync(endpoint, cancellationToken);

        return Result.Success;
    }
}