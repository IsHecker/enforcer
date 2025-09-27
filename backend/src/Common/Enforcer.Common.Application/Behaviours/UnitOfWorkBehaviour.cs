using System.Reflection;
using System.Transactions;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Common.Application.Behaviours;

public class UnitOfWorkBehaviour<TRequest, TResponse>(IServiceProvider serviceProvider) :
    IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
    where TResponse : Result
{
    private static readonly Dictionary<Assembly, Type> contexts = GetAllDbContextTypes();

    public async Task<TResponse> Handle(
    TRequest request,
    RequestHandlerDelegate<TResponse> next,
    CancellationToken cancellationToken)
    {
        var scopeOptions = new TransactionOptions
        {
            IsolationLevel = IsolationLevel.ReadCommitted
        };

        using var scope = new TransactionScope(
            TransactionScopeOption.Required,
            scopeOptions,
            TransactionScopeAsyncFlowOption.Enabled);

        var response = await next();

        if (response.IsFailure)
            return response;

        var contextType = contexts[request.GetType().Assembly];
        var context = (DbContext?)serviceProvider.GetService(contextType);

        await context.SaveChangesAsync(cancellationToken);

        scope.Complete();
        return response;
    }

    private static Dictionary<Assembly, Type> GetAllDbContextTypes()
    {
        return AppDomain.CurrentDomain
            .GetAssemblies()
            .ToDictionary(key => key, val => val.GetTypes().First(t => typeof(DbContext).IsAssignableFrom(t)));
    }
}