using System.Reflection;

namespace Enforcer.Modules.Analytics.Infrastructure;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}