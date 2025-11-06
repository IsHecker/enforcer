using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using MassTransit;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEvents;

public class SubscriptionCanceledIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IUnitOfWork unitOfWork)
    : IConsumer<SubscriptionCanceledIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionCanceledIntegrationEvent> context)
    {
        var apiServiceStat = await serviceStatRepository.GetByApiServiceIdAsync(context.Message.ApiServiceId);

        if (apiServiceStat is null)
            return;

        apiServiceStat.RemoveSubscriber();

        serviceStatRepository.Update(apiServiceStat);

        await unitOfWork.SaveChangesAsync();

        // TODO plan subscription count
    }
}