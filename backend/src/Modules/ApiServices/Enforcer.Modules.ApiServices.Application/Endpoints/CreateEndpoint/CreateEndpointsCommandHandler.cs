using Enforcer.Common.Application.Extensions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Enums.ApiServices;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;

namespace Enforcer.Modules.ApiServices.Application.Endpoints.CreateEndpoint;

internal sealed class CreateEndpointsCommandHandler(
    IEndpointRepository endpointRepository,
    IApiServiceRepository apiServiceRepository,
    IPlanRepository planRepository) : ICommandHandler<CreateEndpointsCommand, IEnumerable<Guid>>
{
    public async Task<Result<IEnumerable<Guid>>> Handle(CreateEndpointsCommand request, CancellationToken cancellationToken)
    {
        var createdIds = new List<Guid>();

        var apiServiceId = request.ApiServiceId;
        var apiService = await apiServiceRepository.GetByIdAsync(apiServiceId, cancellationToken);

        if (apiService is null)
            return ApiServiceErrors.NotFound(apiServiceId);

        foreach (var endpoint in request.Endpoints)
        {
            var plan = await planRepository.GetByIdAsync(endpoint.PlanId, cancellationToken);
            if (plan is null)
                return PlanErrors.NotFound(endpoint.PlanId);

            if (plan.ApiServiceId != apiServiceId)
                return PlanErrors.PlanDoesNotBelongToService;

            if (!plan.IsActive)
                return SubscriptionErrors.InactivePlan;

            var httpMethod = endpoint.HttpMethod.ToEnum<HTTPMethod>();

            var isRouteExist = await endpointRepository.IsRouteExistsAsync(
                apiServiceId,
                httpMethod,
                endpoint.PublicPath,
                cancellationToken);

            if (isRouteExist)
                return EndpointErrors.DuplicateRoute;

            var createEndpointResult = Endpoint.Create(
                apiServiceId,
                endpoint.PlanId,
                httpMethod,
                endpoint.PublicPath,
                endpoint.TargetPath,
                endpoint.RateLimit,
                endpoint.RateLimitWindow?.ToEnum<RateLimitWindow>(),
                endpoint.IsActive);

            if (createEndpointResult.IsFailure)
                return createEndpointResult.Error;

            await endpointRepository.AddAsync(createEndpointResult.Value, cancellationToken);
            createdIds.Add(createEndpointResult.Value.Id);
        }

        return createdIds;
    }
}