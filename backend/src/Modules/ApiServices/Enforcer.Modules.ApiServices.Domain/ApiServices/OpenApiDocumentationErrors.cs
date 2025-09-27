using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public static class OpenApiDocumentationErrors
{
    public static readonly Error InvalidApiServiceId =
        Error.Validation("OpenApi.InvalidApiServiceId", "The ApiServiceId cannot be empty.");

    public static readonly Error EmptyDocumentation =
        Error.Validation("OpenApi.EmptyDocumentation", "Documentation cannot be empty.");
}