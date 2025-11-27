using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class PlanPriceEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OveragePrice",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.AddColumn<long>(
                name: "OveragePriceInCents",
                schema: "ApiServices",
                table: "Plans",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OveragePriceInCents",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.AddColumn<float>(
                name: "OveragePrice",
                schema: "ApiServices",
                table: "Plans",
                type: "real",
                nullable: true);
        }
    }
}
