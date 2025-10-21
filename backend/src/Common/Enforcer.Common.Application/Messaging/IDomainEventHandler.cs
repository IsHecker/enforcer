using Enforcer.Common.Domain.DomainEvents;
using MediatR;

namespace Enforcer.Common.Application.Messaging;

public interface IDomainEventHandler<in TDomainEvent> : INotificationHandler<TDomainEvent>
    where TDomainEvent : IDomainEvent;