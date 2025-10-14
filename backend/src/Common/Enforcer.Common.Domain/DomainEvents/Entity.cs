namespace Enforcer.Common.Domain.DomainEvents;

public abstract class Entity
{
    public Guid Id { get; init; } = Guid.NewGuid();
    private readonly List<IDomainEvent> _domainEvents = [];

    protected Entity()
    {
    }

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.ToList();

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }

    protected void Raise(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
}