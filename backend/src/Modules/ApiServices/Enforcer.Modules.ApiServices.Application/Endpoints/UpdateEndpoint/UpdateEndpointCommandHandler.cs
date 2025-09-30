using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
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

        var publicPath = Endpoint.NormalizePath(request.PublicPath);
        var targetPath = Endpoint.NormalizePath(request.TargetPath);
        var httpMethod = request.HttpMethod.ToEnum<HTTPMethod>();

        var isRouteExist = await endpointRepository.IsRouteExistsAsync(
            endpoint.ApiServiceId,
            httpMethod,
            publicPath,
            cancellationToken);

        if (isRouteExist)
            return EndpointErrors.DuplicateRoute;

        var updateResult = endpoint.Update(
            request.PlanId,
            httpMethod,
            publicPath,
            targetPath,
            request.RateLimit,
            request.RateLimitWindow?.ToEnum<RateLimitWindow>(),
            request.IsActive);

        if (updateResult.IsFailure)
            return updateResult.Error;

        await endpointRepository.UpdateAsync(endpoint, cancellationToken);

        return Result.Success;
    }
}