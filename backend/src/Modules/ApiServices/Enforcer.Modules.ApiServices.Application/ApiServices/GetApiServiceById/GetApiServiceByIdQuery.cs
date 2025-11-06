using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

public readonly record struct GetApiServiceByIdQuery(Guid ApiServiceId) : IQuery<ApiServiceResponse>;