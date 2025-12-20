using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.Billings.Contracts;

namespace Enforcer.Modules.Billings.Application.Payouts.ListPayoutsByCreator;

public readonly record struct ListPayoutsByCreatorQuery(Guid CreatorId, Pagination Pagination)
    : IQuery<PagedResponse<PayoutResponse>>;