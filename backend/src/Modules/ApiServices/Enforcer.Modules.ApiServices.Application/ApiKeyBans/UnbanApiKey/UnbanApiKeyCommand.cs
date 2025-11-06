using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiKeyBans.UnbanApiKey;

public readonly record struct UnbanApiKeyCommand(string ApiKey) : ICommand;