using Enforcer.Common.Domain.Results;
using MediatR;

namespace Enforcer.Common.Application.Messaging;

public interface IQuery<TResponse> : IRequest<Result<TResponse>>;
