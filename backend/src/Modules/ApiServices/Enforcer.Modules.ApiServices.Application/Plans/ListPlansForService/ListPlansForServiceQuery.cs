using Enforcer.Common.Application.Messaging;
using Enforcer.Modules.ApiServices.Contracts.Plans;

namespace Enforcer.Modules.ApiServices.Application.Plans.ListPlansForService;

public readonly record struct ListPlansForServiceQuery(Guid ApiServiceId)
: IQuery<IEnumerable<PlanResponse>>;