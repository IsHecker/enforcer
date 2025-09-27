using System.Reflection;

namespace Enforcer.Modules.ApiServices.Presentation;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}
