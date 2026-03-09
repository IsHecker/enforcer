using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization.Metadata;
using Microsoft.AspNetCore.Http;

namespace Enforcer.Common.Presentation;

[AttributeUsage(AttributeTargets.Property, AllowMultiple = false, Inherited = false)]
public sealed class ExposeToAttribute(params string[] roles) : Attribute
{
    public string[] Roles { get; } = roles;
}

public sealed class RoleBasedJsonTypeInfoResolver(IHttpContextAccessor accessor)
    : DefaultJsonTypeInfoResolver
{
    private readonly IHttpContextAccessor _httpContextAccessor = accessor;

    public override JsonTypeInfo GetTypeInfo(Type type, JsonSerializerOptions options)
    {
        var jsonTypeInfo = base.GetTypeInfo(type, options);

        if (jsonTypeInfo.Kind != JsonTypeInfoKind.Object)
            return jsonTypeInfo;

        var metadata = Get(type);

        foreach (var property in jsonTypeInfo.Properties)
        {
            var attribute = metadata[property.Name.ToLower()];
            if (attribute is null)
                continue;

            property.ShouldSerialize = (_, _) =>
            {
                var user = _httpContextAccessor.HttpContext!.User;
                if (user.Identity is null || !user.Identity.IsAuthenticated)
                    return false;

                return attribute.Roles.Any(role => user.IsInRole(role));
            };
        }

        return jsonTypeInfo;
    }

    public static Dictionary<string, ExposeToAttribute?> Get(Type type)
    {
        return type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .ToDictionary(
                p => p.Name.ToLower(),
                p => p.GetCustomAttribute<ExposeToAttribute>()); ;
    }
}

// builder.Services.ConfigureHttpJsonOptions(opts =>
// {
//     // opts.SerializerOptions.TypeInfoResolverChain.Clear();

//     opts.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
//     opts.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
//     // opts.SerializerOptions.TypeInfoResolverChain.Add(new MyResolver());
//     // opts.SerializerOptions.TypeInfoResolver =
// });

// builder.Services.AddOptions<Microsoft.AspNetCore.Http.Json.JsonOptions>()
//     .Configure<IServiceProvider>((options, provider) =>
//     {
//         options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
//         options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
//         var context = provider.GetRequiredService<IHttpContextAccessor>();
//         options.SerializerOptions.TypeInfoResolver = new RoleBasedJsonTypeInfoResolver(context);
//     });

// builder.Services.AddSingleton<IJsonTypeInfoResolver, RolerResolver>();

// builder.Services.AddSingleton<RolerResolver>();


// public class RolerResolver(IServiceScopeFactory scopeFactory) : IJsonTypeInfoResolver
// {
//     public JsonTypeInfo? GetTypeInfo(Type type, JsonSerializerOptions options)
//     {
//         using var scope = scopeFactory.CreateScope();

//         var cache = scope.ServiceProvider.GetRequiredService<IMemoryCache>();
//         var user = scope.ServiceProvider.GetRequiredService<ClaimsPrincipal>();

//         if (!user.Identities.Any())
//             return null;

//         var info = JsonTypeInfo.CreateJsonTypeInfo<TestResponse>(options);

//         foreach (var property in info.Properties)
//         {
//             if (property.AttributeProvider!.IsDefined(typeof(ExposeToAttribute), false))
//                 continue;

//             var attribute = property.AttributeProvider
//                 .GetCustomAttributes(typeof(ExposeToAttribute), false).First() as ExposeToAttribute;

//             if (attribute!.Roles.Contains(user.GetRole()))
//                 info.Properties.Remove(property);
//         }
//         return info;
//     }
// }