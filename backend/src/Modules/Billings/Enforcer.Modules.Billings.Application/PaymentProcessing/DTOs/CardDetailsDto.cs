namespace Enforcer.Modules.Billings.Application.PaymentProcessing.DTOs;

public readonly record struct CardDetailsDto(
    string LastFourNumbers,
    string Brand,
    int ExpMonth,
    int ExpYear);