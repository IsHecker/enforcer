namespace Enforcer.Modules.Billings.Application.PaymentProcessing.DTOs;

public readonly record struct StripePaymentMethodDto(string Id, CardDetailsDto Card);