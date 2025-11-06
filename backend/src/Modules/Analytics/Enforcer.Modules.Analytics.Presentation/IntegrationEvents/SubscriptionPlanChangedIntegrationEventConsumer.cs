using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using MassTransit;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEvents;

public class SubscriptionPlanChangedIntegrationEventConsumer()
    : IConsumer<SubscriptionPlanChangedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionPlanChangedIntegrationEvent> context)
    {
        // TODO plan subscription count
    }
}