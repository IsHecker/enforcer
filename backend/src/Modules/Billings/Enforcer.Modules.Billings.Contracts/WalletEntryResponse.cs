namespace Enforcer.Modules.Billings.Contracts;

public sealed record WalletEntryResponse(
    Guid Id,
    Guid WalletId,
    string Type,
    long Amount,
    string Currency,
    Guid? ReferenceId,
    string? Description);