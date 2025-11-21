using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.Invoices;

namespace Enforcer.Modules.Billings.Application.PaymentProcessing.CreateCheckoutSession;

internal sealed class CreateCheckoutSessionCommandHandler(
    IStripeService stripeService,
    IApiServicesApi servicesApi,
    IInvoiceRepository invoiceRepository)
    : ICommandHandler<CreateCheckoutSessionCommand, CheckoutSessionResponse>
{
    public async Task<Result<CheckoutSessionResponse>> Handle(
        CreateCheckoutSessionCommand request,
        CancellationToken cancellationToken)
    {
        var plan = await servicesApi.GetPlanByIdAsync(request.PlanId, cancellationToken);

        if (plan is null)
            return Error.NotFound(
                "Plan.NotFound",
                $"The plan with Id '{request.PlanId}' was not found.");

        var invoice = Invoice.Create("USD");

        await invoiceRepository.AddAsync(invoice, cancellationToken);

        var url = await stripeService.CreateCheckoutSessionAsync(
            "cus_TQhMgiqIy35WS7",
            invoice.Id,
            plan.PriceInCents,
            plan.Name,
            request.ReturnUrl,
            cancellationToken);

        return new CheckoutSessionResponse(url);
    }
}