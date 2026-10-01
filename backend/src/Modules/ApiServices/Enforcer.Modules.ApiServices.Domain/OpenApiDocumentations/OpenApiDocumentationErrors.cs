using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;

public static class OpenApiDocumentationErrors
{
    public static readonly Error EmptyDocumentation =
        Error.Validation("OpenApi.EmptyDocumentation", "Documentation cannot be empty.");

    public static Error InvalidDocumentation(string message) =>
        Error.Validation("OpenApi.InvalidDocumentation", $"The provided OpenAPI specification is invalid: {message}");
}