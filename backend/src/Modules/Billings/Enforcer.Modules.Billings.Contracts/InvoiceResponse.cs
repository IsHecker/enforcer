namespace Enforcer.Modules.Billings.Contracts;

public sealed record InvoiceResponse(
    Guid Id,
    string InvoiceNumber,
    string Currency,
    long Subtotal,
    long DiscountTotal,
    long Total,
    DateTime? PeriodStart,
    DateTime? PeriodEnd,
    string Status,
    DateTime IssuedAt,
    DateTime? PaidAt,
    int PaymentAttempts,
    string? Notes,
    List<LineItemResponse> LineItems);

public sealed record LineItemResponse(
    Guid Id,
    string Type,
    string Description,
    int Quantity,
    long UnitPrice,
    long Amount,
    DateTime? PeriodStart,
    DateTime? PeriodEnd);
