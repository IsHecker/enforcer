using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.Analytics.Domain;

public static class ApiServiceStatErrors
{
    public static Error NotFound(Guid serviceId) =>
        Error.NotFound("ApiServiceStat.NotFound", $"ApiServiceStat for ApiService with ID '{serviceId}' was not found.");
}