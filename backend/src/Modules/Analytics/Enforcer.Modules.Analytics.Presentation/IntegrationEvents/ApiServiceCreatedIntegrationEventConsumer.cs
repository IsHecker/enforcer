using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents;
using MassTransit;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEvents;

public class ApiServiceCreatedIntegrationEventConsumer(
    IApiServiceStatRepository serviceStatRepository,
    IUnitOfWork unitOfWork) : IConsumer<ApiServiceCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<ApiServiceCreatedIntegrationEvent> context)
    {
        var apiServiceStat = ApiServiceStat.Create(context.Message.ApiServiceId);
        await serviceStatRepository.AddAsync(apiServiceStat);
        await unitOfWork.SaveChangesAsync();
    }
}