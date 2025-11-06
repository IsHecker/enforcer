using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public sealed class OpenApiDocumentation : Entity
{
    public string Documentation { get; private set; } = null!;

    private OpenApiDocumentation() { }

    public static Result<OpenApiDocumentation> Create(string documentation)
    {
        if (string.IsNullOrWhiteSpace(documentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        var doc = new OpenApiDocumentation
        {
            Documentation = documentation
        };

        return doc;
    }

    public Result UpdateDocumentation(string newDocumentation)
    {
        if (string.IsNullOrWhiteSpace(newDocumentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        Documentation = newDocumentation;

        Raise(new DocumentationUpdatedEvent(Id));

        return Result.Success;
    }
}