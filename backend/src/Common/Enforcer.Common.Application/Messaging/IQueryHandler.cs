using Enforcer.Common.Domain.Results;
using MediatR;

namespace Enforcer.Common.Application.Messaging;

public interface IQueryHandler<in TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
    where TQuery : IQuery<TResponse>;