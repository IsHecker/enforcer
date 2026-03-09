using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Domain.Wallets;

namespace Enforcer.Modules.Billings.Application.Abstractions.Services;

public interface IWithdrawalService
{
    Task<Result> ProcessPayoutAsync(
        Wallet wallet,
        long amount,
        DateTime periodStart,
        DateTime periodEnd,
        bool isManual = false,
        CancellationToken cancellationToken = default);
}