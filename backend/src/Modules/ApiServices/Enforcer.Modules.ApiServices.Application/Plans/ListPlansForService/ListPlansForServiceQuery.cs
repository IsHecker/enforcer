using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans.ListPlansForService;

public sealed record ListPlansForServiceQuery(Guid ApiServiceId)
: IQuery<IReadOnlyList<PlanResponse>>;