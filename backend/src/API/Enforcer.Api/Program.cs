using Enforcer.Modules.ApiServices.Infrastructure;
using Enforcer.Common.Application;
using Enforcer.Common.Infrastructure;
using System.Reflection;
using Enforcer.Api.Middleware;

internal class Program
{
    private static void Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        builder.Services.AddProblemDetails();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        Assembly[] moduleApplicationAssemblies = [
            AssemblyReference.Assembly];

        builder.Services.AddApplication(moduleApplicationAssemblies);

        builder.Services.AddInfrastructure();

        builder.Services.AddApiServicesModule(builder.Configuration);

        WebApplication app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.Run();
    }
}