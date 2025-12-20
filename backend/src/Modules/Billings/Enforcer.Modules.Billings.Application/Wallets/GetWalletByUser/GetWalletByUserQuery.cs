using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.Wallets.GetWalletByUser;

public readonly record struct GetWalletByUserQuery(Guid UserId)
    : IQuery<WalletResponse>;