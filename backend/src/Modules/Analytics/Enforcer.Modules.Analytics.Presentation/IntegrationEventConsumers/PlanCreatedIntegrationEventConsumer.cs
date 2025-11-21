using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents.Plans;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class PlanCreatedIntegrationEventConsumer(
    IPlanStatRepository planStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork) : IConsumer<PlanCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<PlanCreatedIntegrationEvent> context)
    {
        var cancellationToken = context.CancellationToken;

        var planStat = PlanStat.Create(context.Message.PlanId);

        await planStatRepository.AddAsync(planStat, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}