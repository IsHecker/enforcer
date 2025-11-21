using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.ApiServices.IntegrationEvents.Subscriptions;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class SubscriptionPlanChangedIntegrationEventConsumer(
    IPlanStatRepository planStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork)
    : IConsumer<SubscriptionPlanChangedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<SubscriptionPlanChangedIntegrationEvent> context)
    {
        var cancellationToken = context.CancellationToken;

        var oldPlanStat = await planStatRepository.GetByPlanIdAsync(context.Message.OldPlanId, cancellationToken);
        var currentPlanStat = await planStatRepository.GetByPlanIdAsync(context.Message.CurrentPlanId, cancellationToken);

        if (oldPlanStat is null || currentPlanStat is null)
            return;

        oldPlanStat.CancelSubscriber();
        currentPlanStat.AddSubscriber();

        planStatRepository.Update(oldPlanStat);
        planStatRepository.Update(currentPlanStat);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}