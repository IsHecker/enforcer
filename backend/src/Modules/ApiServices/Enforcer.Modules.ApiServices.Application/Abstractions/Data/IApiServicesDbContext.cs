using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Enforcer.Modules.ApiServices.Domain.Usages;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Data;

public interface IApiServicesDbContext
{
    DbSet<ApiService> ApiServices { get; }
    DbSet<Endpoint> Endpoints { get; }
    DbSet<OpenApiDocumentation> OpenApiDocumentations { get; }

    DbSet<QuotaUsage> QuotaUsages { get; }

    DbSet<Subscription> Subscriptions { get; }
    DbSet<Plan> Plans { get; }
    DbSet<PlanFeature> PlanFeatures { get; }

    DbSet<ApiKeyBan> ApiKeyBans { get; }
}