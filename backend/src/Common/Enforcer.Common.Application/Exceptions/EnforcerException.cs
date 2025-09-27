using Enforcer.Common.Domain.Results;

namespace Enforcer.Common.Application.Exceptions;

public sealed class EnforcerException : Exception
{
    public EnforcerException(string requestName, Error? error = default, Exception? innerException = default)
        : base("Application exception", innerException)
    {
        RequestName = requestName;
        Error = error;
    }

    public string RequestName { get; }

    public Error? Error { get; }
}
