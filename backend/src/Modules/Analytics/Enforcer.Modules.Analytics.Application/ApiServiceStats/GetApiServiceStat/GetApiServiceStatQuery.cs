using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Analytics.Contracts;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats.GetApiServiceStat;

public readonly record struct GetApiServiceStatQuery(Guid ApiServiceId) : IQuery<ApiServiceStatResponse>;