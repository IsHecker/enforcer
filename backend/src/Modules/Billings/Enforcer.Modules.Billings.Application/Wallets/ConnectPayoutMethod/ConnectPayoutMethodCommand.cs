using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.Wallets.ConnectPayoutMethod;

public readonly record struct ConnectPayoutMethodCommand(Guid UserId, string ReturnUrl) : ICommand<SessionResponse>;