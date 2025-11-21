using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Analytics.Domain;

public sealed class Rating : Entity
{
    public Guid ConsumerId { get; private set; }
    public Guid ApiServiceId { get; private set; }
    public byte Value { get; private set; }

    private Rating() { }

    public static Rating Create(Guid consumerId, Guid apiServiceId, byte value)
    {
        return new Rating
        {
            ConsumerId = consumerId,
            ApiServiceId = apiServiceId,
            Value = value
        };
    }

    public void Update(byte newValue)
    {
        Value = newValue;
    }
}