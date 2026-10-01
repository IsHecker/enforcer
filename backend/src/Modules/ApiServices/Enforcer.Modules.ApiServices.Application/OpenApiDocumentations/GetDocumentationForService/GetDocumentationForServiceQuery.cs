using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.GetDocumentationForService;

public sealed record GetDocumentationForServiceQuery(Guid ApiServiceId) : IQuery<string>;