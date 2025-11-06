using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.Analytics.Application.ApiServiceStats.RateApiService;

public readonly record struct RateApiServiceCommand(Guid ConsumerId, Guid ApiServiceId, byte? Rating) : ICommand;