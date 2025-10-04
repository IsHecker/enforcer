using System.Transactions;
using Enforcer.Common.Application.Data;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain.Results;
using MediatR;

namespace Enforcer.Common.Application.Behaviours;

public class UnitOfWorkBehaviour<TRequest, TResponse>(IEnumerable<IUnitOfWork> units) :
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

        foreach (var unitOfWork in units)
        {
            if (IsFromSameModule(typeof(TRequest), unitOfWork.GetType()))
                await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        scope.Complete();
        return response;
    }

    private static bool IsFromSameModule(Type requestType, Type uowType)
    {
        ReadOnlySpan<char> requestAssembly = requestType.Assembly.GetName().Name;
        ReadOnlySpan<char> uowAssembly = uowType.Assembly.GetName().Name;

        var LastDotIndex = requestAssembly.LastIndexOf('.');

        if (LastDotIndex < 0)
            return false;

        var reqModuleName = requestAssembly[..LastDotIndex];
        var uowModuleName = uowAssembly[..LastDotIndex];

        return reqModuleName.SequenceEqual(uowModuleName);
    }
}