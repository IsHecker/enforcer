using Enforcer.Common.Infrastructure.Data;
using Enforcer.Modules.Users.Application;
using Enforcer.Modules.Users.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Enforcer.Common.Infrastructure.Extensions;
using Enforcer.Common.Application.Data;
using Enforcer.Modules.Users.Application.Abstractions.Data;

namespace Enforcer.Modules.Users.Infrastructure.Database;

public sealed class UsersDbContext(DbContextOptions<UsersDbContext> options) : DbContext(options), IUsersDbContext, IUnitOfWork
{
    public DbSet<User> Users { get; init; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schemas.Users);

        modelBuilder.StoreAllEnumsAsNames();

        modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
    }
}