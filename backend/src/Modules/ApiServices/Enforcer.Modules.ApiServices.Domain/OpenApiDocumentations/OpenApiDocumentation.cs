using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.OpenApiDocumentations;

public sealed class OpenApiDocumentation : Entity
{
    public Guid ApiServiceId { get; private set; }
    public string Documentation { get; private set; } = null!;

    private OpenApiDocumentation() { }

    public static Result<OpenApiDocumentation> Create(Guid apiServiceId, string documentation)
    {
        if (string.IsNullOrWhiteSpace(documentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        var doc = new OpenApiDocumentation
        {
            ApiServiceId = apiServiceId,
            Documentation = documentation
        };

        return doc;
    }

    public Result UpdateDocumentation(string newDocumentation)
    {
        if (string.IsNullOrWhiteSpace(newDocumentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        Documentation = newDocumentation;

        return Result.Success;
    }
}