namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

public sealed record ApiServiceResponse(
    Guid Id,
    string Name,
    string Description,
    string Category,
    string BasePath,
    string TargetUrl,
    string? LogoUrl,
    bool IsPublic,
    string Status,
    int SubscriptionsCount,
    Guid? ApiDocId,
    string Version);