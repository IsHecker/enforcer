using Enforcer.Common.Application.Messaging;

namespace Enforcer.Modules.ApiServices.Application.OpenApiDocumentations.UploadDocumentation;

public readonly record struct UploadDocumentationCommand(Guid ApiServiceId, string Specification) : ICommand;