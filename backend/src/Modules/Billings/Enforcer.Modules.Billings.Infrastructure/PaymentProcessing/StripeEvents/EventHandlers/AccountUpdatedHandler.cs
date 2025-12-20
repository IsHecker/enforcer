using Enforcer.Common.Application.Data;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents.EventHandlers;

[StripeEvent(EventTypes.AccountUpdated)]
internal sealed class AccountUpdatedHandler(
    IWalletRepository walletRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork) : StripeEventHandler<Account>
{
    public override async Task<Result> HandleAsync(Account account)
    {
        var wallet = await walletRepository
            .GetByStripeAccountIdAsync(account.Id);

        if (!wallet!.IsOnboardingComplete
            && account.PayoutsEnabled
            && account.ChargesEnabled
            && account.Capabilities.Transfers == "active"
            && account.Requirements.CurrentlyDue.IsNullOrEmpty()
            && account.Requirements.Errors.IsNullOrEmpty())
        {
            wallet.CompleteOnboarding();
        }

        await unitOfWork.SaveChangesAsync();

        return Result.Success;
    }
}