using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.WalletEntries;

public sealed class WalletEntry : Entity
{
    public Guid WalletId { get; private set; }
    public WalletEntryType Type { get; private set; }

    public long Amount { get; private set; }
    public string Currency { get; private set; }

    public Guid? ReferenceId { get; private set; }
    public string? Description { get; private set; }

    private WalletEntry() { }

    public static WalletEntry Create(
        Guid walletId,
        WalletEntryType type,
        long amount,
        string currency = "USD",
        Guid? referenceId = null,
        string? description = null)
    {
        if (amount == 0)
            throw new ArgumentException("Amount cannot be zero.", nameof(amount));

        return new WalletEntry
        {
            WalletId = walletId,
            Type = type,
            Amount = amount,
            Currency = currency,
            ReferenceId = referenceId,
            Description = description
        };
    }
}
