using Enforcer.Modules.Users.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.Users.Application.Abstractions.Data;

public interface IUsersDbContext
{
    DbSet<User> Users { get; init; }
}