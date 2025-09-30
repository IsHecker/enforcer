using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.UpdateApiService;

public sealed record UpdateApiServiceCommand(
    Guid ApiServiceId,
    string Name,
    string Description,
    string Category,
    string ServiceKey,
    string TargetBaseUrl,
    string? LogoUrl,
    bool IsPublic,
    string Status,
    string Version
) : ICommand;