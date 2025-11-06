using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EntityUpdate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Subscriptions",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "QuotaUsages",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Plans",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "PlanFeatures",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "OpenApiDocumentations",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Endpoints",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiServices",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiKeyBlacklist",
                newName: "UpdatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "Subscriptions",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "QuotaUsages",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "Plans",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "PlanFeatures",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "OpenApiDocumentations",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "Endpoints",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "ApiServices",
                newName: "Updated");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                schema: "ApiServices",
                table: "ApiKeyBlacklist",
                newName: "Updated");
        }
    }
}
