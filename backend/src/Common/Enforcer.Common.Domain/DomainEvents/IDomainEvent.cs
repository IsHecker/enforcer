using MediatR;

namespace Enforcer.Common.Domain.DomainEvents;

public interface IDomainEvent : INotification
{
    Guid Id { get; }

    DateTime OccurredOnUtc { get; }
}