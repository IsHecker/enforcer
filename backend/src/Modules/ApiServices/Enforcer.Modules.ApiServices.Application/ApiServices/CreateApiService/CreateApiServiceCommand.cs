using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Domain.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.CreateApiService;

public record CreateApiServiceCommand(
    string Name,
    string Description,
    ApiCategory Category,
    string ServiceKey,
    string TargetBaseUrl,
    string? LogoUrl,
    bool IsPublic,
    ServiceStatus Status) : ICommand<Guid>;