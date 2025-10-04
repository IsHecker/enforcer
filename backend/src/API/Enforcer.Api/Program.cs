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

        builder.Services.AddDistributedMemoryCache();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerDocumentation();

        Assembly[] moduleApplicationAssemblies = [
            Enforcer.Modules.ApiServices.Application.AssemblyReference.Assembly];

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure();

        builder.Services.AddGatewayModule();
        builder.Services.AddApiServicesModule(builder.Configuration);

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseExceptionHandler();

        app.UseGatewayPipeline();

        app.MapEndpoints();

        app.Run();
    }
}