using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Usages;

namespace Enforcer.Modules.ApiServices.Application.QuotaUsages.GetSubscriptionQuotaUsage;

public readonly record struct GetSubscriptionQuotaUsageQuery(Guid SubscriptionId) : IQuery<QuotaUsageResponse>;