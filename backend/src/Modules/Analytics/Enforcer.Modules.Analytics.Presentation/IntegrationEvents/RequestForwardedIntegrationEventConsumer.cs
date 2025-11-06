using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Gateway.IntegrationEvents;
using MassTransit;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEvents;

public class RequestForwardedIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IEndpointStatRepository endpointStatRepository,
    ISubscriptionStatRepository subscriptionStatRepository,
    IUnitOfWork unitOfWork) : IConsumer<RequestForwardedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<RequestForwardedIntegrationEvent> context)
    {
        var message = context.Message;

        var apiServiceStat = await serviceStatRepository.GetByApiServiceIdAsync(message.ApiServiceId);

        if (apiServiceStat is null)
            return;

        var endpointStat = await endpointStatRepository.GetByEndpointIdAsync(message.EndpointId);

        if (endpointStat is null)
            return;

        var subscriptionStat = await subscriptionStatRepository.GetBySubscriptionIdAsync(message.SubscriptionId);

        if (subscriptionStat is null)
            return;

        apiServiceStat.RecordApiCall(message.StatusCode, message.ResponseTimeMs);
        endpointStat.RecordApiCall(message.StatusCode, message.ResponseTimeMs);

        endpointStatRepository.Update(endpointStat);
        serviceStatRepository.Update(apiServiceStat);

        await unitOfWork.SaveChangesAsync();
    }
}