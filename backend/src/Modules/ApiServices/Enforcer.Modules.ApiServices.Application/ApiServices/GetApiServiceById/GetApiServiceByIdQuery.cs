using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

public sealed record GetApiServiceByIdQuery(Guid ApiServiceId) : IQuery<ApiServiceResponse>;