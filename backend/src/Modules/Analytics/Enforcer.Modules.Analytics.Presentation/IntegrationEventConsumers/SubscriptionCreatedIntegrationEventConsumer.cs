using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class SubscriptionCreatedIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IPlanStatRepository planStatRepository,
    ISubscriptionStatRepository subscriptionStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork)
    : IConsumer<SubscriptionCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionCreatedIntegrationEvent> context)
    {
        var message = context.Message;
        var cancellationToken = context.CancellationToken;

        await ProcessApiServiceStatAsync(message, cancellationToken);
        await ProcessPlanStatAsync(message, cancellationToken);
        await CreateSubscriptionStatAsync(message, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task ProcessApiServiceStatAsync(
        SubscriptionCreatedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var serviceStat = await serviceStatRepository.GetByApiServiceIdAsync(message.ApiServiceId, cancellationToken);

        if (serviceStat is null)
            return;

        serviceStat.AddSubscriber();
        serviceStatRepository.Update(serviceStat);
    }

    private async Task ProcessPlanStatAsync(
        SubscriptionCreatedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var planStat = await planStatRepository.GetByPlanIdAsync(message.PlanId, cancellationToken);

        if (planStat is null)
            return;

        planStat.AddSubscriber();
        planStatRepository.Update(planStat);
    }

    private async Task CreateSubscriptionStatAsync(
        SubscriptionCreatedIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var subscriptionStat = SubscriptionStat.Create(message.SubscriptionId);
        await subscriptionStatRepository.AddAsync(subscriptionStat, cancellationToken);
    }
}