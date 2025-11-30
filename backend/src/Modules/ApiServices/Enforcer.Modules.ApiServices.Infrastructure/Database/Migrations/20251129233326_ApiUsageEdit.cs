using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ApiUsageEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiUsages_Subscriptions_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages");

            migrationBuilder.AddForeignKey(
                name: "FK_ApiUsages_Subscriptions_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages",
                column: "SubscriptionId",
                principalSchema: "ApiServices",
                principalTable: "Subscriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApiUsages_Subscriptions_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages");

            migrationBuilder.AddForeignKey(
                name: "FK_ApiUsages_Subscriptions_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages",
                column: "SubscriptionId",
                principalSchema: "ApiServices",
                principalTable: "Subscriptions",
                principalColumn: "Id");
        }
    }
}
