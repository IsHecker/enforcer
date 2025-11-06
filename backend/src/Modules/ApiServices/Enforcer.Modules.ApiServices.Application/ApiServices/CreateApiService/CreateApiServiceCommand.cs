using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public readonly record struct CreateApiServiceCommand(
    Guid CreatorId,
    string Name,
    string Description,
    string Category,
    string ServiceKey,
    string TargetBaseUrl,
    string? LogoUrl,
    bool IsPublic,
    string Status
) : ICommand<Guid>;