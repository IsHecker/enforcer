namespace Enforcer.Api.Extensions;

internal static class ConfigurationExtensions
{
    internal static void AddModuleConfiguration(this IConfigurationBuilder configurationBuilder, string[] modules)
    {
        foreach (var module in modules)
        {
            configurationBuilder.AddJsonFile($"ModulesConfig/modules.{module}.json", false, true);
            configurationBuilder.AddJsonFile($"ModulesConfig/modules.{module}.Development.json", true, true);
        }
    }
}