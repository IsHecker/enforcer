namespace Enforcer.Common.Domain.DomainEvents;

public abstract class Entity
{
    public Guid Id { get; init; } = Guid.NewGuid();

    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

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