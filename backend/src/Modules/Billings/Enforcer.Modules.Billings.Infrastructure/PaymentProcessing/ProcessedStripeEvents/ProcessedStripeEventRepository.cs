using Enforcer.Modules.Billings.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;

public class ProcessedStripeEventRepository(BillingsDbContext context)
{
    public Task<bool> IsEventProcessedAsync(string eventId, CancellationToken ct = default)
    {
        return context.ProcessedStripeEvents.AnyAsync(e => e.EventId == eventId, ct);
    }

    public async Task MarkEventAsProcessedAsync(string eventId, CancellationToken ct = default)
    {
        await context.ProcessedStripeEvents.AddAsync(new ProcessedStripeEvent
        {
            EventId = eventId
        }, ct);

        await context.SaveChangesAsync(ct);
    }
}