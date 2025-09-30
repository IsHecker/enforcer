namespace Enforcer.Common.Application.Extensions;

public static class EnumExtensions
{
    public static string AllowedValuesMessage<TEnum>() where TEnum : struct, Enum
    {
        return $"'{nameof(TEnum)}' must be one of: {string.Join(", ", Enum.GetNames(typeof(TEnum)))}";
    }
}