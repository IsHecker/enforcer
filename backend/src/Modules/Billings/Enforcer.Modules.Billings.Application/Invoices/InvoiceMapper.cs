using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Invoices;

namespace Enforcer.Modules.Billings.Application.Invoices;

public static class InvoiceMapper
{
    public static InvoiceResponse ToResponse(this Invoice invoice) =>
        new(
            invoice.Id,
            invoice.InvoiceNumber,
            invoice.Currency,
            invoice.Subtotal,
            invoice.DiscountTotal,
            invoice.Total,
            invoice.PeriodStart,
            invoice.PeriodEnd,
            invoice.Status.ToString(),
            invoice.IssuedAt,
            invoice.PaidAt,
            invoice.PaymentAttempts,
            invoice.Notes,
            invoice.LineItems.Select(li => li.ToResponse()).ToList()
        );

    public static LineItemResponse ToResponse(this LineItem lineItem) =>
        new(
            lineItem.Id,
            lineItem.Type.ToString(),
            lineItem.Description,
            lineItem.Quantity,
            lineItem.UnitPrice,
            lineItem.Amount,
            lineItem.PeriodStart,
            lineItem.PeriodEnd
        );
}
