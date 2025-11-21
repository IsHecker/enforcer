using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class SubscriptionCanceledIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IPlanStatRepository planStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork)
    : IConsumer<SubscriptionCanceledIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionCanceledIntegrationEvent> context)
    {
        var message = context.Message;
        var cancellationToken = context.CancellationToken;

        await ProcessApiServiceStatAsync(message, cancellationToken);
        await ProcessPlanStatAsync(message, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private async Task ProcessApiServiceStatAsync(
        SubscriptionCanceledIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var serviceStat = await serviceStatRepository.GetByApiServiceIdAsync(message.ApiServiceId, cancellationToken);

        if (serviceStat is null)
            return;

        serviceStat.RemoveSubscriber();
        serviceStatRepository.Update(serviceStat);
    }

    private async Task ProcessPlanStatAsync(
        SubscriptionCanceledIntegrationEvent message,
        CancellationToken cancellationToken)
    {
        var planStat = await planStatRepository.GetByPlanIdAsync(message.PlanId, cancellationToken);

        if (planStat is null)
            return;

        planStat.CancelSubscriber();
        planStatRepository.Update(planStat);
    }
}