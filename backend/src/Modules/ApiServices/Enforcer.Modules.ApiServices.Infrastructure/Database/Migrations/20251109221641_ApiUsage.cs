using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ApiUsage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuotaUsages",
                schema: "ApiServices");

            migrationBuilder.CreateTable(
                name: "ApiUsages",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    QuotasLeft = table.Column<int>(type: "int", nullable: false),
                    OverageUsed = table.Column<int>(type: "int", nullable: false),
                    ResetAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApiUsages_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "ApiServices",
                        principalTable: "Subscriptions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApiUsages_SubscriptionId",
                schema: "ApiServices",
                table: "ApiUsages",
                column: "SubscriptionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiUsages",
                schema: "ApiServices");

            migrationBuilder.CreateTable(
                name: "QuotaUsages",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuotasLeft = table.Column<int>(type: "int", nullable: false),
                    ResetAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotaUsages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotaUsages_Subscriptions_SubscriptionId",
                        column: x => x.SubscriptionId,
                        principalSchema: "ApiServices",
                        principalTable: "Subscriptions",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_QuotaUsages_SubscriptionId",
                schema: "ApiServices",
                table: "QuotaUsages",
                column: "SubscriptionId");
        }
    }
}
