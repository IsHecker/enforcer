using Enforcer.Modules.ApiServices.Domain.ApiKeyBans;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.ApiUsages;
using Enforcer.Modules.ApiServices.Domain.Endpoints;
using Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;
using Enforcer.Modules.ApiServices.Domain.Plans;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Application.Abstractions.Data;

public interface IApiServicesDbContext
{
    DbSet<ApiService> ApiServices { get; }
    DbSet<Endpoint> Endpoints { get; }
    DbSet<OpenApiDocumentation> OpenApiDocumentations { get; }

    DbSet<ApiUsage> ApiUsages { get; }

    DbSet<Subscription> Subscriptions { get; }
    DbSet<Plan> Plans { get; }
    DbSet<PlanFeature> PlanFeatures { get; }

    DbSet<ApiKeyBan> ApiKeyBans { get; }
}