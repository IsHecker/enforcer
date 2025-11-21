using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents.ApiServices;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class ApiServiceCreatedIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork) : IConsumer<ApiServiceCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<ApiServiceCreatedIntegrationEvent> context)
    {
        var cancellationToken = context.CancellationToken;

        var apiServiceStat = ApiServiceStat.Create(context.Message.ApiServiceId);

        await serviceStatRepository.AddAsync(apiServiceStat, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}