using Enforcer.Modules.ApiServices.Infrastructure;
using Enforcer.Common.Application;
using Enforcer.Common.Infrastructure;
using System.Reflection;
using Enforcer.Api.Middleware;
using Enforcer.Common.Presentation.Endpoints;
using Enforcer.Api.Extensions;
using Enforcer.Modules.Gateway.Core;
using Serilog;
using System.Text.Json.Serialization;
using Enforcer.Modules.Analytics.Infrastructure;

internal class Program
{
    private static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Host.UseSerilog((context, loggerConfig) => loggerConfig.ReadFrom.Configuration(context.Configuration));

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        builder.Services.ConfigureHttpJsonOptions(opts =>
        {
            opts.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
            opts.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerDocumentation();

        Assembly[] moduleApplicationAssemblies = [
            Enforcer.Modules.ApiServices.Application.AssemblyReference.Assembly,
            Enforcer.Modules.Analytics.Application.AssemblyReference.Assembly
        ];

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure([AnalyticsModule.ConfigureConsumers]);

        builder.Configuration.AddModuleConfiguration(["apiservices"]);

        builder.Services.AddApiServicesModule(builder.Configuration);
        builder.Services.AddAnalyticsModule(builder.Configuration);
        builder.Services.AddGatewayModule();

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
        });

        builder.Services.AddAuthorization();

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseRouting();
        app.UseCors("AllowAll");
        app.UseAuthorization();

        app.UseSerilogRequestLogging();
        app.UseExceptionHandler();
        app.UseGatewayPipeline();
        app.MapEndpoints();

        app.Run();
    }
}