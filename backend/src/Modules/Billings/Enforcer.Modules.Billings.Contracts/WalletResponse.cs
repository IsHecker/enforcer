namespace Enforcer.Modules.Billings.Contracts;

public sealed record WalletResponse(
    Guid UserId,
    long Balance,
    long Credits,
    long LifetimeEarnings,
    string Currency,
    DateTime? LastPayoutAt,
    bool IsOnboardingComplete,
    bool IsPayoutMethodConfigured
);