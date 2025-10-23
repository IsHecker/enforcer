using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class SubscriptionEditRemove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_ConsumerId_PlanId_ApiKey",
                schema: "ApiServices",
                table: "Subscriptions");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ApiKey",
                schema: "ApiServices",
                table: "Subscriptions",
                column: "ApiKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ConsumerId_PlanId",
                schema: "ApiServices",
                table: "Subscriptions",
                columns: new[] { "ConsumerId", "PlanId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_ApiKey",
                schema: "ApiServices",
                table: "Subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_ConsumerId_PlanId",
                schema: "ApiServices",
                table: "Subscriptions");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ConsumerId_PlanId_ApiKey",
                schema: "ApiServices",
                table: "Subscriptions",
                columns: new[] { "ConsumerId", "PlanId", "ApiKey" },
                unique: true);
        }
    }
}
