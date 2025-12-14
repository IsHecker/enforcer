using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure.Data;
using Enforcer.Common.Infrastructure.Interceptors;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Modules.Billings.Application.Abstractions.Data;
using Enforcer.Modules.Billings.Application.Abstractions.Payments;
using Enforcer.Modules.Billings.Application.Abstractions.Repositories;
using Enforcer.Modules.Billings.Application.Abstractions.Services;
using Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.ExpiredSubscriptionCleanup;
using Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.PayoutCycle;
using Enforcer.Modules.Billings.Infrastructure.BackgroundJobs.SubscriptionRenewal;
using Enforcer.Modules.Billings.Infrastructure.Database;
using Enforcer.Modules.Billings.Infrastructure.Invoices;
using Enforcer.Modules.Billings.Infrastructure.PaymentMethods;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.ProcessedStripeEvents;
using Enforcer.Modules.Billings.Infrastructure.PaymentProcessing.StripeEvents;
using Enforcer.Modules.Billings.Infrastructure.Payments;
using Enforcer.Modules.Billings.Infrastructure.Payouts;
using Enforcer.Modules.Billings.Infrastructure.PromotionalCodes;
using Enforcer.Modules.Billings.Infrastructure.PublicApi;
using Enforcer.Modules.Billings.Infrastructure.RefundTransactions;
using Enforcer.Modules.Billings.Infrastructure.Services;
using Enforcer.Modules.Billings.Infrastructure.WalletEntries;
using Enforcer.Modules.Billings.Infrastructure.Wallets;
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
        AddDbContext(services, configuration);
        ConfigureBackgroundJobs(services, configuration);
        AddStripe(services, configuration);
        AddRepositories(services);
        AddServices(services);

        services.Configure<PayoutOptions>(
            configuration.GetSection(PayoutOptions.SectionName));

        services.AddScoped<IBillingsApi, BillingsApi>();
    }

    private static void ConfigureBackgroundJobs(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SubscriptionRenewalOptions>(
            configuration.GetSection(SubscriptionRenewalOptions.SectionName));

        services.ConfigureOptions<SubscriptionRenewalJobConfiguration>();


        services.Configure<ExpiredSubscriptionCleanupOptions>(
            configuration.GetSection(ExpiredSubscriptionCleanupOptions.SectionName));

        services.ConfigureOptions<ExpiredSubscriptionCleanupJobConfiguration>();


        services.Configure<PayoutCycleOptions>(
            configuration.GetSection(PayoutCycleOptions.SectionName));

        services.ConfigureOptions<ProcessPayoutCycleJobConfiguration>();
    }

    private static void AddDbContext(IServiceCollection services, IConfiguration configuration)
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
    }

    private static void AddStripe(IServiceCollection services, IConfiguration configuration)
    {
        Stripe.StripeConfiguration.ApiKey = configuration[$"{StripeOptions.SectionName}:SecretKey"];

        services.Configure<StripeOptions>(configuration.GetSection(StripeOptions.SectionName));
        services.AddScoped<ProcessedStripeEventRepository>();

        services.AddScoped<IStripeEventDispatcher, StripeEventDispatcher>();

        services.AddScoped<IStripeGateway, StripeGateway>();
    }

    private static void AddRepositories(IServiceCollection services)
    {
        services.AddScoped<IPaymentMethodRepository, PaymentMethodRepository>();
        services.AddScoped<IInvoiceRepository, InvoiceRepository>();
        services.AddScoped<IPromotionalCodeRepository, PromotionalCodeRepository>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<PromotionalCodeUsageRepository>();
        services.AddScoped<PaymentRepository>();
        services.AddScoped<RefundTransactionRepository>();
        services.AddScoped<WalletRepository>();
        services.AddScoped<WalletEntryRepository>();
        services.AddScoped<PayoutRepository>();
    }

    private static void AddServices(IServiceCollection services)
    {
        services.AddScoped<SubscriptionRenewalService>();
        services.AddScoped<PlanSwitchBillingService>();
        services.AddScoped<PromoCodeService>();
        services.AddScoped<SubscriptionCancellationRefundService>();

        services.AddScoped<IWithdrawalService, WithdrawalService>();
    }
}