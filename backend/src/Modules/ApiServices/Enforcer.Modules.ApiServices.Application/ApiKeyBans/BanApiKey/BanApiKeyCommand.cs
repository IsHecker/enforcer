using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.BanApiKey;

public readonly record struct BanApiKeyCommand(
    Guid CreatorId,
    string ApiKey,
    string Reason,
    DateTime? ExpiresAt = null
) : ICommand;