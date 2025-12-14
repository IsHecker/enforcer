using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.WalletEntries;

namespace Enforcer.Modules.Billings.Application.WalletEntries;

public static class WalletEntryMapper
{
    public static WalletEntryResponse ToResponse(this WalletEntry walletEntry) =>
        new(
            walletEntry.Id,
            walletEntry.WalletId,
            walletEntry.Type.ToString(),
            walletEntry.Amount,
            walletEntry.Currency,
            walletEntry.ReferenceId,
            walletEntry.Description);
}