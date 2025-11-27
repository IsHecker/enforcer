using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EditApiUsageFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ApiUsages_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages");

            migrationBuilder.CreateIndex(
                name: "IX_ApiUsages_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages",
                column: "SubscriptionId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ApiUsages_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages");

            migrationBuilder.CreateIndex(
                name: "IX_ApiUsages_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages",
                column: "SubscriptionId");
        }
    }
}
