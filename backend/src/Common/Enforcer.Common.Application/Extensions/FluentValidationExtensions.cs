using FluentValidation;

namespace Enforcer.Common.Application.Extensions;

public static class FluentValidationExtensions
{
    public static IRuleBuilderOptions<T, string> MustBeEnumValue<T, TEnum>(
        this IRuleBuilder<T, string> ruleBuilder)
        where TEnum : struct, Enum
    {
        return ruleBuilder
            .Must(value => Enum.TryParse<TEnum>(value, true, out _))
            .WithMessage(EnumExtensions.AllowedValuesMessage<TEnum>());
    }
}