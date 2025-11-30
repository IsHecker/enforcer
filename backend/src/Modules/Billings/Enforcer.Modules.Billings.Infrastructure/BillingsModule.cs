using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Common.Infrastructure.Interceptors;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.ExpiredSubscriptionCleanup;
using Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Enforcer.Modules.Billings.Infrastructure.Invoices;
using Enforcer.Modules.Billings.Infrastructure.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Enforcer.Modules.Billings.Infrastructure.PublicApi;
using Enforcer.Modules.Billings.Infrastructure.PublicApi.Services;
using Enforcer.Modules.Billings.Infrastructure.RefundTransactions;
using Enforcer.Modules.Billings.PublicApi;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Enforcer.Modules.Billings.Infrastructure;

public static class BillingsModule
{
    public static IServiceCollection AddBillingsModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddEndpoints(Presentation.AssemblyReference.Assembly);

        services.AddInfrastructure(configuration);

        return services;
    }

    private static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BillingsDbContext>((sp, opts) =>
            opts.UseSqlServer(
                    configuration.GetConnectionString("Database"),
                    sqlOpts => sqlOpts
                        .MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.Billings))
                .AddInterceptors(sp.GetRequiredService<PublishDomainEventsInterceptor>())
                .LogTo(_ => { }, LogLevel.None));

        services.AddKeyedScoped<IUnitOfWork>(nameof(Billings), (sp, _) => sp.GetRequiredService<BillingsDbContext>());
        services.AddScoped<IBillingsDbContext>(sp => sp.GetRequiredService<BillingsDbContext>());


        ConfigureBackgroundJobs(services, configuration);
        AddStripe(services, configuration);
    }

    private static void ConfigureBackgroundJobs(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SubscriptionRenewalOptions>(configuration.GetSection(SubscriptionRenewalOptions.SectionName));
        services.ConfigureOptions<SubscriptionRenewalJobConfiguration>();

        services.Configure<ExpiredSubscriptionCleanupOptions>(configuration.GetSection(ExpiredSubscriptionCleanupOptions.SectionName));
        services.ConfigureOptions<ExpiredSubscriptionCleanupJobConfiguration>();
    }

    private static void AddStripe(IServiceCollection services, IConfiguration configuration)
    {
        Stripe.StripeConfiguration.ApiKey = configuration[$"{StripeOptions.SectionName}:SecretKey"];

        services.Configure<StripeOptions>(configuration.GetSection(StripeOptions.SectionName));

        services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddScoped<PaymentRepository>();
        services.AddScoped<RefundTransactionRepository>();
        services.AddScoped<ProcessedStripeEventRepository>();

        services.AddScoped<IStripeEventDispatcher, StripeEventDispatcher>();

        services.AddScoped<IStripeGateway, StripeGateway>();

        services.AddScoped<SubscriptionRenewalService>();
        services.AddScoped<PlanSwitchBillingService>();
        services.AddScoped<SubscriptionCancellationRefundService>();

        services.AddScoped<IBillingsApi, BillingsApi>();
    }
}