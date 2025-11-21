namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;

[AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = false)]
internal class StripeEventAttribute : Attribute
{
    public string EventType { get; }

    public StripeEventAttribute(string eventType) => EventType = eventType;
}