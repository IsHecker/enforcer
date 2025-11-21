using System.Reflection;

namespace Enforcer.Modules.Billings.Infrastructure;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}