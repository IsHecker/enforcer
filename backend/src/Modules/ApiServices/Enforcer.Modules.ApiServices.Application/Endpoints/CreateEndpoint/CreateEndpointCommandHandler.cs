using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Application.Plans;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

internal sealed class CreateEndpointCommandHandler(
    IEndpointRepository endpointRepository,
    IApiServiceRepository apiServiceRepository,
    IPlanRepository planRepository) : ICommandHandler<CreateEndpointCommand, Guid>
{
    public async Task<Result<Guid>> Handle(CreateEndpointCommand request, CancellationToken cancellationToken)
    {
        var apiService = await apiServiceRepository.GetByIdAsync(request.ApiServiceId, cancellationToken);
        if (apiService is null)
            return ApiServiceErrors.NotFound(request.ApiServiceId);

        var plan = await planRepository.GetByIdAsync(request.PlanId, cancellationToken);
        if (plan is null)
            return PlanErrors.NotFound(request.PlanId);

        if (plan.ApiServiceId != request.ApiServiceId)
            return PlanErrors.PlanDoesNotBelongToService;

        if (!plan.IsActive)
            return PlanErrors.InactivePlan;

        var httpMethod = request.HttpMethod.ToEnum<HTTPMethod>();
        var publicPath = Endpoint.NormalizePath(request.PublicPath);
        var targetPath = Endpoint.NormalizePath(request.TargetPath);

        var isRouteExist = await endpointRepository.IsRouteExistsAsync(
            request.ApiServiceId,
            httpMethod,
            publicPath,
            cancellationToken);

        if (isRouteExist)
            return EndpointErrors.DuplicateRoute;

        var createResult = Endpoint.Create(
            request.ApiServiceId,
            request.PlanId,
            httpMethod,
            publicPath,
            targetPath,
            request.RateLimit,
            request.RateLimitWindow?.ToEnum<RateLimitWindow>(),
            request.IsActive);

        if (createResult.IsFailure)
            return createResult.Error;

        var endpoint = createResult.Value;

        await endpointRepository.AddAsync(endpoint, cancellationToken);

        return endpoint.Id;
    }
}