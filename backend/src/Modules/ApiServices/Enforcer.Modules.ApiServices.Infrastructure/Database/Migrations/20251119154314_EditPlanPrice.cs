using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EditPlanPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.AddColumn<long>(
                name: "PriceInCents",
                schema: "ApiServices",
                table: "Plans",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceInCents",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.AddColumn<float>(
                name: "Price",
                schema: "ApiServices",
                table: "Plans",
                type: "real",
                nullable: true);
        }
    }
}
