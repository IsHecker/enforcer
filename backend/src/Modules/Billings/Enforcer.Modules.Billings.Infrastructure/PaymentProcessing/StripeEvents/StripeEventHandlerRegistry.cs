using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;

public class StripeEventHandlerRegistry
{
    private readonly Dictionary<string, Func<IServiceProvider, Event, CancellationToken, Task>> _handlers;

    public StripeEventHandlerRegistry()
    {
        _handlers = new Dictionary<string, Func<IServiceProvider, Event, CancellationToken, Task>>(
            StringComparer.OrdinalIgnoreCase);
    }

    public void Register<TEvent>(string eventType, Func<IServiceProvider, Event, CancellationToken, Task> handler)
        where TEvent : Event
    {
        _handlers[eventType] = handler;
    }

    public bool TryGetHandler(string eventType, out Func<IServiceProvider, Event, CancellationToken, Task> handler)
    {
        return _handlers.TryGetValue(eventType, out handler);
    }

    public bool HasHandler(string eventType) => _handlers.ContainsKey(eventType);
}