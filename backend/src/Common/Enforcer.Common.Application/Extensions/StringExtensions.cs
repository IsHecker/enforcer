namespace Enforcer.Common.Application.Extensions;

public static class StringExtensions
{
    public static TEnum ToEnum<TEnum>(this string source) where TEnum : struct
    {
        return Enum.Parse<TEnum>(source, ignoreCase: true);
    }
}