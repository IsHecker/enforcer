namespace Enforcer.Modules.ApiServices.Contracts.ApiServices;

public sealed record ApiServiceResponse(
    Guid Id,
    string Name,
    string Description,
    string Category,
    string ServiceKey,
    string TargetBaseUrl,
    string? LogoUrl,
    bool IsPublic,
    string Status,
    int SubscriptionsCount,
    Guid? ApiDocId,
    string Version
);