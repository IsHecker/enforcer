namespace Enforcer.Common.Domain.Results;

public enum ErrorType
{
    None,
    NotFound,
    Validation,
    Unauthorized,
    Conflict,
    Forbidden,
    Failure,
    Problem,
    Unexpected
}