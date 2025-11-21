using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PaymentProcessing.CreateSetupSession;

public readonly record struct CreateSetupSessionCommand(
    Guid ConsumerId,
    string ReturnUrl) : ICommand<CheckoutSessionResponse>;