using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;

public class ProcessedStripeEventRepository(BillingsDbContext context)
{
    public Task<bool> IsEventProcessedAsync(string eventId, CancellationToken cancellationToken = default)
    {
        return context.ProcessedStripeEvents.AnyAsync(e => e.EventId == eventId, cancellationToken);
    }

    public async Task MarkEventAsProcessedAsync(string eventId, CancellationToken cancellationToken = default)
    {
        await context.ProcessedStripeEvents.AddAsync(new ProcessedStripeEvent
        {
            EventId = eventId
        }, cancellationToken);

        await context.SaveChangesAsync(cancellationToken);
    }
}