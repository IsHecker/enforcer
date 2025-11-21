using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.SubscriptionStats.GetSubscriptionStat;

public readonly record struct GetSubscriptionStatQuery(Guid SubscriptionId) : IQuery<SubscriptionStatResponse>;