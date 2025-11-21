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
using Enforcer.Modules.Billings.Infrastructure;

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
            Enforcer.Modules.Analytics.Application.AssemblyReference.Assembly,
            Enforcer.Modules.Billings.Application.AssemblyReference.Assembly,
        ];

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure([AnalyticsModule.ConfigureConsumers]);

        builder.Configuration.AddModuleConfiguration(["apiservices", "billings"]);

        builder.Services.AddApiServicesModule(builder.Configuration);
        builder.Services.AddAnalyticsModule(builder.Configuration);
        builder.Services.AddBillingsModule(builder.Configuration);
        builder.Services.AddGatewayModule();

        builder.Services.AddCors(opts =>
            opts.AddDefaultPolicy(p =>
                p.AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin()));

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseCors();

        app.UseSerilogRequestLogging();
        app.UseExceptionHandler();
        app.UseGatewayPipeline();
        app.MapEndpoints();

        app.Run();
    }
}