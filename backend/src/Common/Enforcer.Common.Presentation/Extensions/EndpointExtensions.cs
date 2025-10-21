using Microsoft.AspNetCore.Builder;

namespace Enforcer.Common.Presentation.Extensions;

public static class EndpointExtensions
{
    public static TBuilder WithOpenApiName<TBuilder>(
        this TBuilder builder,
        string endpointName,
        string? description = null)
        where TBuilder : IEndpointConventionBuilder
    {
        return builder.WithOpenApi(op =>
        {
            op.Summary = endpointName;

            if (description is not null)
                op.Description = description;

            return op;
        });
    }
}