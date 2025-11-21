using Enforcer.Common.Application.Data;
using Enforcer.Modules.Analytics.Application.Abstractions.Repositories;
using Enforcer.Modules.Analytics.Domain;
using Enforcer.Modules.ApiServices.IntegrationEvents.Endpoints;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Analytics.Presentation.IntegrationEventConsumers;

public class EndpointCreatedIntegrationEventConsumer(
    IEndpointStatRepository endpointStatRepository,
    [FromKeyedServices(nameof(Analytics))] IUnitOfWork unitOfWork) : IConsumer<EndpointCreatedIntegrationEvent>
{
    public async Task Consume(ConsumeContext<EndpointCreatedIntegrationEvent> context)
    {
        var cancellationToken = context.CancellationToken;

        var endpointStat = EndpointStat.Create(context.Message.EndpointId);

        await endpointStatRepository.AddAsync(endpointStat, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}