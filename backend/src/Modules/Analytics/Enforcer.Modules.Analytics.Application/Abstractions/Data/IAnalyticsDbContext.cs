using Enforcer.Modules.Analytics.Domain;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Analytics.Application.Abstractions.Data;

public interface IAnalyticsDbContext
{
    DbSet<ApiServiceStat> ApiServiceStats { get; }
    DbSet<EndpointStat> EndpointStats { get; }
    DbSet<SubscriptionStat> SubscriptionStats { get; }
    DbSet<Rating> Ratings { get; }
}