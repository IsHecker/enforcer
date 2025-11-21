using System.Transactions;
using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.DomainEvents;
using Enforcer.Common.Domain.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Enforcer.Common.Application.Behaviours;

internal class UnitOfWorkBehaviour<TRequest, TResponse>(IServiceProvider serviceProvider) :
    IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
    where TResponse : Result
{
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

        var moduleKey = GetModuleName(typeof(TRequest));
        var unitOfWork = serviceProvider.GetKeyedService<IUnitOfWork>(moduleKey);

        if (unitOfWork is not null)
        {
            UpdateEntityDates(unitOfWork);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        scope.Complete();
        return response;
    }

    private static void UpdateEntityDates(IUnitOfWork unitOfWork)
    {
        var context = (DbContext)unitOfWork;

        var entities = context
            .ChangeTracker
            .Entries<Entity>()
            .Where(entry => entry.State == EntityState.Modified)
            .Select(entry => entry.Entity);

        foreach (var entity in entities)
        {
            entity.UpdatedAt = DateTime.UtcNow;
        }
    }

    private static string GetModuleName(Type requestType)
    {
        const string expectedPrefix = "Enforcer.Modules.";

        ReadOnlySpan<char> requestAssembly = requestType.Assembly.GetName().Name;
        var withoutPrefix = requestAssembly[expectedPrefix.Length..];
        var lastDotIndex = withoutPrefix.LastIndexOf('.');

        if (lastDotIndex < 0)
            return withoutPrefix.ToString();

        return withoutPrefix[..lastDotIndex].ToString();
    }
}