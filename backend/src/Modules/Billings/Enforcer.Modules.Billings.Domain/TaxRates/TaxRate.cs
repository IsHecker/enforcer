using Enforcer.Common.Domain.DomainEvents;

namespace Enforcer.Modules.Billings.Domain.TaxRates;

public sealed class TaxRate : Entity
{
    public string Country { get; private set; } = null!;
    public string? State { get; private set; }
    public string? PostalCode { get; private set; }
    public string TaxName { get; private set; } = null!;
    public decimal TaxRateValue { get; private set; }
    public TaxType TaxType { get; private set; }
    public AppliesTo AppliesTo { get; private set; }
    public bool IsActive { get; private set; }

    public DateTime EffectiveFrom { get; private set; }
    public DateTime? EffectiveTo { get; private set; }

    private TaxRate() { }
}