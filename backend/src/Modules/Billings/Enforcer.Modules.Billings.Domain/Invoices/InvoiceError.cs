using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Billings.Domain.Invoices;

public static class InvoiceError
{
    public static Error NotFound(Guid id) =>
        Error.NotFound(
            "Invoice.NotFound",
            $"The invoice with Id '{id}' was not found.");
}