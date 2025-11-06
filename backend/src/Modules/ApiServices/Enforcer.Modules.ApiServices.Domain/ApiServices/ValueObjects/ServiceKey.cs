using Enforcer.Common.Domain.Results;

namespace Enforcer.Modules.ApiServices.Domain.ApiServices.ValueObjects;

public readonly struct ServiceKey
{
    public string Value { get; }

    private ServiceKey(string value) => Value = value;

    public static Result<ServiceKey> Create(ReadOnlySpan<char> serviceKey)
    {
        const int maxStackLength = 256;
        serviceKey = serviceKey.Trim();

        Span<char> lowerCase = serviceKey.Length <= maxStackLength
            ? stackalloc char[serviceKey.Length]
            : new char[serviceKey.Length];

        serviceKey.ToLowerInvariant(lowerCase);

        if (!IsValid(lowerCase))
            return ApiServiceErrors.InvalidServiceKey;

        return new ServiceKey(lowerCase.ToString());

    }

    private static bool IsValid(ReadOnlySpan<char> serviceKey)
    {
        if (serviceKey.IsEmpty)
            return false;

        if (!char.IsLetterOrDigit(serviceKey[0]) || !char.IsLetterOrDigit(serviceKey[^1]))
            return false;

        const char separator = '-';

        for (int i = 0; i < serviceKey.Length; i++)
        {
            char currentChar = serviceKey[i];

            if (char.IsLetterOrDigit(currentChar))
                continue;

            if (!currentChar.Equals(separator))
                return false;

            char previousChar = serviceKey[i - 1];
            if (previousChar.Equals(separator))
                return false;
        }

        return true;
    }
}