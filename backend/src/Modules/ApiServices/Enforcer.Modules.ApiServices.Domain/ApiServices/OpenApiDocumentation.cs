using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using Enforcer.Modules.ApiServices.Domain.ApiServices.Events;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices;

public class OpenApiDocumentation : Entity
{
    public Guid ApiServiceId { get; private set; }
    public string Documentation { get; private set; } = null!;

    private OpenApiDocumentation() { }

    public static Result<OpenApiDocumentation> Create(Guid apiServiceId, string documentation)
    {
        if (apiServiceId == Guid.Empty)
            return OpenApiDocumentationErrors.InvalidApiServiceId;

        if (string.IsNullOrWhiteSpace(documentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        var doc = new OpenApiDocumentation
        {
            ApiServiceId = apiServiceId,
            Documentation = documentation
        };

        doc.Raise(new DocumentationCreatedEvent(doc.Id, doc.ApiServiceId));

        return doc;
    }

    public Result UpdateDocumentation(string newDocumentation)
    {
        if (string.IsNullOrWhiteSpace(newDocumentation))
            return OpenApiDocumentationErrors.EmptyDocumentation;

        Documentation = newDocumentation;

        Raise(new DocumentationUpdatedEvent(Id, ApiServiceId));

        return Result.Success;
    }
}