using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Enforcer.Api.Extensions;

internal static class SwaggerExtensions
{
    internal static IServiceCollection AddSwaggerDocumentation(this IServiceCollection services)
    {
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Enforcer API",
                Version = "v1",
                Description = "Enforcer API built using the modular monolith architecture."
            });

            options.CustomSchemaIds(t => t.FullName?.Replace("+", "."));
            options.SchemaFilter<EnumSchemaFilter>();
        });

        return services;
    }
}

internal sealed class EnumSchemaFilter : ISchemaFilter
{
    public void Apply(OpenApiSchema schema, SchemaFilterContext context)
    {
        if (!context.Type.IsEnum)
            return;

        schema.Enum = Enum
            .GetNames(context.Type)
            .Select(n => new OpenApiString(n))
            .ToList<IOpenApiAny>();
    }
}