using Enforcer.Common.Application.Data;
using Enforcer.Common.Infrastructure;
using Enforcer.Modules.ApiServices.Application.Abstractions.Data;
using Enforcer.Modules.ApiServices.Domain.ApiServices;
using Enforcer.Modules.ApiServices.Domain.Subscriptions;
using Microsoft.EntityFrameworkCore;

namespace Enforcer.Modules.ApiServices.Infrastructure.Database;

public class ApiServicesDbContext : DbContext, IUnitOfWork, IApiServicesDbContext
{
   public ApiServicesDbContext(DbContextOptions options) : base(options) { }

   public DbSet<ApiService> ApiServices { get; init; }
   public DbSet<Endpoint> Endpoints { get; init; }
   public DbSet<OpenApiDocumentation> OpenApiDocumentations { get; init; }

   public DbSet<Subscription> Subscriptions { get; init; }
   public DbSet<Plan> Plans { get; init; }
   public DbSet<PlanFeature> PlanFeatures { get; init; }

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.HasDefaultSchema(Schemas.ApiServices);

      modelBuilder.StoreAllEnumsAsNames();

      modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Assembly);
   }
}



/*

Implement the "" use case by following all principles(DDD rules, modular monolith principles, and best practices) and without violating anything, and with all the files, Domain Properties & methods, Domain Rules, updates, errors, fluent validators if needed and codes needed.



👉 **Extra / Advanced use cases:**

* **CloneEndpoint** – Duplicate an existing endpoint into another plan/service (time saver for API providers).
* **BulkUpdateEndpoints** – Apply changes (e.g., rate limit) across multiple endpoints at once.
* **TestEndpoint** – Validate target path connectivity and configuration before publishing.

---

### 🔹 **Documentation Use Cases**

1. **UploadDocumentation** – Attach OpenAPI/Swagger documentation to an API service.
2. **UpdateDocumentation** – Update the documentation when the API evolves.
3. **DeleteDocumentation** – Remove existing documentation.
4. **GetDocumentationByService** – Fetch documentation for a given API service.

👉 **Extra / Advanced use cases:**

* **GenerateDocumentationFromEndpoints** – Auto-generate base OpenAPI docs from defined endpoints.
* **VersionDocumentation** – Keep multiple versions of API documentation (important for backward compatibility).
* **PublishDocumentation** – Make docs public vs. internal-only.

*/