using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Gateway.IntegrationEvents;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class RequestForwardedIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IEndpointStatRepository endpointStatRepository,
    ISubscriptionStatRepository subscriptionStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork) : IConsumer<RequestForwardedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<RequestForwardedIntegrationEvent> context)
    {
        var message = context.Message;
        var cancellationToken = context.CancellationToken;

        await ProcessApiServiceStatAsync(message, cancellationToken);
        await ProcessEndpointStatAsync(message, cancellationToken);
        await ProcessSubscriptionStatAsync(message, cancellationToken);

        await unitOfWork.SaveChangesAsync();
    }

    private async Task ProcessApiServiceStatAsync(RequestForwardedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var apiServiceStat = await serviceStatRepository.GetByApiServiceIdAsync(message.ApiServiceId, cancellationToken);

        if (apiServiceStat is null)
            return;

        apiServiceStat.RecordApiCall(message.StatusCode, message.ResponseTimeMs);
        serviceStatRepository.Update(apiServiceStat);
    }

    private async Task ProcessEndpointStatAsync(RequestForwardedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var endpointStat = await endpointStatRepository.GetByEndpointIdAsync(message.EndpointId, cancellationToken);

        if (endpointStat is null)
            return;

        endpointStat.RecordApiCall(message.StatusCode, message.ResponseTimeMs);
        endpointStatRepository.Update(endpointStat);
    }

    private async Task ProcessSubscriptionStatAsync(RequestForwardedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var subscriptionStat = await subscriptionStatRepository.GetBySubscriptionIdAsync(
            message.SubscriptionId,
            cancellationToken);

        if (subscriptionStat is null)
            return;

        subscriptionStat.RecordApiCall();
        subscriptionStatRepository.Update(subscriptionStat);
    }
}