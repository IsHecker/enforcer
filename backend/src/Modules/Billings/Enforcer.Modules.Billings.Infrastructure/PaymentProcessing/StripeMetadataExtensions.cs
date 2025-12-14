using Stripe;

namespace Enforcer.Modules.Billings.Infrastructure.PaymentProcessing;

internal readonly record struct StripeMetadataKey<TValue>(string Key);

internal static class MetadataKeys
{
    public static readonly StripeMetadataKey<Guid> InvoiceId = new("InvoiceId");

    public static readonly StripeMetadataKey<Guid> CreatorId = new("CreatorId");

    public static readonly StripeMetadataKey<Guid> RefundId = new("RefundId");

    public static readonly StripeMetadataKey<Guid> PaymentMethodId = new("PaymentMethodId");

    public static readonly StripeMetadataKey<Guid> ConsumerId = new("ConsumerId");

    public static readonly StripeMetadataKey<Guid> PlanId = new("PlanId");

    public static readonly StripeMetadataKey<Guid> PayoutId = new("PayoutId");

    public static readonly StripeMetadataKey<Guid> UserId = new("UserId");

    public static readonly StripeMetadataKey<string> CheckoutMode = new("CheckoutMode");
}

internal static class StripeMetadataExtensions
{
    private static readonly Dictionary<Type, Func<string, object>> Converters = new()
    {
        [typeof(Guid)] = s => Guid.Parse(s),
        [typeof(string)] = s => s
    };

    private static TValue ConvertValue<TValue>(string raw)
    {
        var targetType = typeof(TValue);

        if (!Converters.TryGetValue(targetType, out var converter))
            throw new NotSupportedException($"Type {targetType.Name} is not supported for metadata conversion.");

        return (TValue)converter(raw);
    }

    public static TEntity WithKey<TEntity, TValue>(this TEntity entity, StripeMetadataKey<TValue> key, TValue value)
        where TEntity : IHasMetadata
    {
        entity.Metadata ??= [];

        entity.Metadata[key.Key] = value?.ToString();
        return entity;
    }


    public static TValue Get<TValue>(this IHasMetadata entity, StripeMetadataKey<TValue> key)
    {
        if (!entity.Metadata.TryGetValue(key.Key, out var raw))
            throw new KeyNotFoundException($"Metadata key '{key.Key}' not found.");

        return ConvertValue<TValue>(raw);
    }

    public static bool TryGet<TValue>(
        this IHasMetadata entity,
        StripeMetadataKey<TValue> key,
        out TValue value)
    {
        value = default!;

        if (!entity.Metadata.TryGetValue(key.Key, out var raw))
            return false;

        value = ConvertValue<TValue>(raw);
        return true;
    }

    public static bool IsCheckoutMode(this IHasMetadata entity)
    {
        return entity.Metadata.ContainsKey(MetadataKeys.CheckoutMode.Key);
    }
}