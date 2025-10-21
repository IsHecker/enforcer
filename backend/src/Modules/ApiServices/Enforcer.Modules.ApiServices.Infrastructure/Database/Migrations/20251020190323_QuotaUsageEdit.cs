using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class QuotaUsageEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_QuotaUsages_ApiServices_ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages");

            migrationBuilder.DropIndex(
                name: "IX_QuotaUsages_ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages");

            migrationBuilder.DropColumn(
                name: "ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_QuotaUsages_ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages",
                column: "ApiServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_QuotaUsages_ApiServices_ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages",
                column: "ApiServiceId",
                principalSchema: "ApiServices",
                principalTable: "ApiServices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
