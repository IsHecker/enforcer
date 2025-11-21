using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Analytics.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class MoreStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlanStats",
                schema: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalSubscribers = table.Column<int>(type: "int", nullable: false),
                    ActiveSubscribers = table.Column<int>(type: "int", nullable: false),
                    CancellationsThisMonth = table.Column<int>(type: "int", nullable: false),
                    MonthTrackingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanStats", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionStats",
                schema: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SubscriptionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalApiCalls = table.Column<long>(type: "bigint", nullable: false),
                    ApiCallsUsedThisMonth = table.Column<long>(type: "bigint", nullable: false),
                    MonthUsageDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionStats", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlanStats",
                schema: "Analytics");

            migrationBuilder.DropTable(
                name: "SubscriptionStats",
                schema: "Analytics");
        }
    }
}
