using Enforcer.Modules.ApiServices.Infrastructure;
using Enforcer.Common.Application;
using Enforcer.Common.Infrastructure;
using System.Reflection;
using Enforcer.Api.Middleware;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Api.Extensions;
using Enforcer.Modules.Gateway;

internal class Program
{
    private static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerDocumentation();

        Assembly[] moduleApplicationAssemblies = [
            Enforcer.Modules.ApiServices.Application.AssemblyReference.Assembly];

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure();

        builder.Configuration.AddModuleConfiguration(["apiservices"]);

        builder.Services.AddApiServicesModule(builder.Configuration);
        builder.Services.AddGatewayModule();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseExceptionHandler();

        app.UseGatewayPipeline();

        app.MapEndpoints();

        app.MapGet("posts/{param1}/segment3/{param2}", (string param1, string param2) => "first");
        app.MapGet("posts/segment3/{optional?}/{optional2?}", (string? optional, string? optional2) => "second");
        app.MapGet("posts/segment3/{optional?}", (string? optional) => "thirds");
        app.MapGet("posts/segment3", () => "fourth");
        // app.MapGet("posts/{id}", (string id) => "third");

        app.Run();
    }
}