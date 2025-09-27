using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.Subscriptions.IsUserSubscribedToService;

public record IsUserSubscribedToServiceQuery(Guid ConsumerId, Guid ApiServiceId) : IQuery<bool>;
