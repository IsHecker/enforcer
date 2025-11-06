using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class SubscriptionCountEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubscriptionsCount",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "SubscriptionsCount",
                schema: "ApiServices",
                table: "ApiServices");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubscriptionsCount",
                schema: "ApiServices",
                table: "Plans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SubscriptionsCount",
                schema: "ApiServices",
                table: "ApiServices",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
