using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddQuotaUsage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Endpoints_ApiServiceId",
                schema: "ApiServices",
                table: "Endpoints");

            migrationBuilder.DropIndex(
                name: "IX_Endpoints_HTTPMethod_PublicPath",
                schema: "ApiServices",
                table: "Endpoints");

            migrationBuilder.AlterColumn<string>(
                name: "HTTPMethod",
                schema: "ApiServices",
                table: "Endpoints",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ApiKeyBlacklist",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Duration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BannedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BannedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiKeyBlacklist", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QuotaUsages",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuotasLeft = table.Column<int>(type: "int", nullable: false),
                    ResetAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotaUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotaUsages_ApiServices_ApiServiceId",
                        column: x => x.ApiServiceId,
                        principalSchema: "ApiServices",
                        principalTable: "ApiServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotaUsages_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "ApiServices",
                        principalTable: "Subscriptions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Endpoints_ApiServiceId_HTTPMethod_PublicPath",
                schema: "ApiServices",
                table: "Endpoints",
                columns: new[] { "ApiServiceId", "HTTPMethod", "PublicPath" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuotaUsages_ApiServiceId",
                schema: "ApiServices",
                table: "QuotaUsages",
                column: "ApiServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotaUsages_SubscriptionId",
                schema: "ApiServices",
                table: "QuotaUsages",
                column: "SubscriptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiKeyBlacklist",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "QuotaUsages",
                schema: "ApiServices");

            migrationBuilder.DropIndex(
                name: "IX_Endpoints_ApiServiceId_HTTPMethod_PublicPath",
                schema: "ApiServices",
                table: "Endpoints");

            migrationBuilder.AlterColumn<string>(
                name: "HTTPMethod",
                schema: "ApiServices",
                table: "Endpoints",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Endpoints_ApiServiceId",
                schema: "ApiServices",
                table: "Endpoints",
                column: "ApiServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Endpoints_HTTPMethod_PublicPath",
                schema: "ApiServices",
                table: "Endpoints",
                columns: new[] { "HTTPMethod", "PublicPath" },
                unique: true,
                filter: "[HTTPMethod] IS NOT NULL");
        }
    }
}
