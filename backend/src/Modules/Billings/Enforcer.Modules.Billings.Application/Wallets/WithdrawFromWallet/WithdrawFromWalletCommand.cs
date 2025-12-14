using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Billings.Application.Wallets.WithdrawFromWallet;

public readonly record struct WithdrawFromWalletCommand(Guid WalletId) : ICommand;