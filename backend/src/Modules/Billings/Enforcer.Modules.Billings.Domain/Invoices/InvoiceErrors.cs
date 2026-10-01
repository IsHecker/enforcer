using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public static class InvoiceErrors
{
    public static Error NotFound(Guid id) =>
        Error.NotFound("Invoice.NotFound", $"Invoice with ID '{id}' was not found.");

    public static Error CannotTransition(InvoiceStatus from, InvoiceStatus to) =>
        Error.Validation("Invoice.InvalidTransition",
            $"Cannot transition invoice from '{from}' to '{to}'.");
}