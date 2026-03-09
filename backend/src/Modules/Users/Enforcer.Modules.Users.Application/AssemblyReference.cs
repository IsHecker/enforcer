using System.Reflection;

namespace Enforcer.Modules.Users.Application;

public static class AssemblyReference
{
    public static readonly Assembly Assembly = typeof(AssemblyReference).Assembly;
}