using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiUsages;

namespace Enforcer.Modules.ApiServices.Application.ApiUsages.GetSubscriptionApiUsage;

public readonly record struct GetSubscriptionApiUsageQuery(Guid SubscriptionId) : IQuery<ApiUsageResponse>;