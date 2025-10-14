using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.ApiServices;

namespace Enforcer.Modules.ApiServices.Application.ApiServices.GetApiServiceById;

public sealed record GetApiServiceByIdQuery(Guid ApiServiceId) : IQuery<ApiServiceResponse>;