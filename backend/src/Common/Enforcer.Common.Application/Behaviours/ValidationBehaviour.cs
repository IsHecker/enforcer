using System.Reflection;
using Enforcer.Common.Application.Messaging;
using Enforcer.Common.Domain;
using Enforcer.Common.Domain.Results;
using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace Enforcer.Common.Application.Behaviours;

internal sealed class ValidationBehaviour<TRequest, TResponse>(
    IEnumerable<IValidator<TRequest>> validators)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IBaseCommand
    where TResponse : Result
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        ValidationFailure[] validationFailures = await ValidateAsync(request);

        if (validationFailures.Length == 0)
            return await next();


        if (!typeof(TResponse).IsGenericType &&
            typeof(TResponse) == typeof(Result))
        {
            return (TResponse)Result.Failure(CreateValidationError(validationFailures));
        }


        Type resultType = typeof(TResponse).GetGenericArguments()[0];

        MethodInfo? failureMethod = typeof(Result<>)
            .MakeGenericType(resultType)
            .GetMethod(nameof(Result<object>.Failure));

        if (failureMethod is not null)
        {
            return (TResponse)failureMethod.Invoke(null, [CreateValidationError(validationFailures)])!;
        }

        throw new ValidationException(validationFailures);
    }

    private async Task<ValidationFailure[]> ValidateAsync(TRequest request)
    {
        if (!validators.Any())
            return Array.Empty<ValidationFailure>();

        var context = new ValidationContext<TRequest>(request);

        ValidationResult[] validationResults = await Task.WhenAll(
            validators.Select(validator => validator.ValidateAsync(context)));

        ValidationFailure[] validationFailures = validationResults
            .Where(validationResult => !validationResult.IsValid)
            .SelectMany(validationResult => validationResult.Errors)
            .ToArray();

        return validationFailures;
    }

    private static ValidationError CreateValidationError(ValidationFailure[] validationFailures) =>
        new(validationFailures.Select(f => Error.Problem(f.ErrorCode, f.ErrorMessage)).ToArray());
}