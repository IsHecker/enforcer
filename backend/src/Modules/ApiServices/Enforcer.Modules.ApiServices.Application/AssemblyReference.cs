using System.Reflection;

namespace Enforcer.Modules.ApiServices.Application;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
