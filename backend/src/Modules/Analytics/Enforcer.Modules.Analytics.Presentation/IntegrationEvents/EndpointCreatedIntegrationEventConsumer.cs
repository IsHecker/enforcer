using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents;
using MassTransit;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEvents;

public class EndpointCreatedIntegrationEventConsumer(
    IEndpointStatRepository endpointStatRepository,
    IUnitOfWork unitOfWork) : IConsumer<EndpointCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EndpointCreatedIntegrationEvent> context)
    {
        var endpointStat = EndpointStat.Create(context.Message.EndpointId);
        await endpointStatRepository.AddAsync(endpointStat);
        await unitOfWork.SaveChangesAsync();
    }
}