using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Contracts.Plans;
using Enforcer.Modules.ApiServices.PublicApi;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Contracts;
using Enforcer.Modules.Billings.Domain.InvoiceLineItems;
using Enforcer.Modules.Billings.Domain.Invoices;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Modules.Billings.Application.PaymentProcessing.CreateCheckoutSession;

internal sealed class CreateCheckoutSessionCommandHandler(
    IStripeGateway stripeService,
    IApiServicesApi servicesApi,
    IInvoiceRepository invoiceRepository,
    [FromKeyedServices(nameof(Billings))] IUnitOfWork unitOfWork)
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

        var invoice = await CreateInvoiceAsync(Guid.Empty, plan, cancellationToken);

        var url = await stripeService.CreateCheckoutSessionAsync(
            "cus_TQhMgiqIy35WS7",
            invoice,
            request.ReturnUrl,
            cancellationToken);

        return new CheckoutSessionResponse(url);
    }

    private async Task<Invoice> CreateInvoiceAsync(
        Guid consumerId,
        PlanResponse plan,
        CancellationToken cancellationToken)
    {
        var lineItem = InvoiceLineItem.Create(
            InvoiceItemType.Subscription,
            $"{plan.Name} - Subscription",
            quantity: 1,
            unitPrice: plan.PriceInCents
        );

        var invoice = Invoice.Create(
            consumerId,
            "USD",
            [lineItem]
        );

        await invoiceRepository.AddAsync(invoice, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return invoice;
    }
}