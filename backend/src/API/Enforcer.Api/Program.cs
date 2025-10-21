using Enforcer.Modules.ApiServices.Infrastructure;
using Enforcer.Common.Application;
using Enforcer.Common.Infrastructure;
using System.Reflection;
using Enforcer.Api.Middleware;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Api.Extensions;
using Enforcer.Modules.Gateway;
using Serilog;

internal class Program
{
    private static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((context, loggerConfig) => loggerConfig.ReadFrom.Configuration(context.Configuration));

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

        app.UseSerilogRequestLogging();
        app.UseExceptionHandler();
        app.UseGatewayPipeline();
        app.MapEndpoints();

        app.Run();
    }
}