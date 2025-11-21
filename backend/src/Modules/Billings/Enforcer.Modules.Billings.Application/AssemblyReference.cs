using System.Reflection;

namespace Enforcer.Modules.Billings.Application;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}