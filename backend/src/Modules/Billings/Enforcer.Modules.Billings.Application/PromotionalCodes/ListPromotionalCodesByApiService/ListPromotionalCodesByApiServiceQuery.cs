using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.PromotionalCodes.ListPromotionalCodesByApiService;

public readonly record struct ListPromotionalCodesByApiServiceQuery(Guid ApiServiceId, Guid CreatorId, Pagination Pagination)
    : IQuery<PagedResponse<PromotionalCodeResponse>>;