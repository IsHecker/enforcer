using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Analytics.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Analytics");

            migrationBuilder.CreateTable(
                name: "ApiServiceStats",
                schema: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalApiCalls = table.Column<long>(type: "bigint", nullable: false),
                    FailedApiCalls = table.Column<long>(type: "bigint", nullable: false),
                    TotalResponseTimeMs = table.Column<float>(type: "real", nullable: false),
                    ActiveSubscribers = table.Column<int>(type: "int", nullable: false),
                    TotalSubscribers = table.Column<int>(type: "int", nullable: false),
                    AverageRating = table.Column<float>(type: "real", nullable: false),
                    TotalRatings = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiServiceStats", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EndpointStats",
                schema: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EndpointId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TotalApiCalls = table.Column<long>(type: "bigint", nullable: false),
                    FailedApiCalls = table.Column<long>(type: "bigint", nullable: false),
                    DailyCountDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalResponseTimeMs = table.Column<float>(type: "real", nullable: false),
                    DailyCallCount = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EndpointStats", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ratings",
                schema: "Analytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConsumerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Value = table.Column<byte>(type: "tinyint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ratings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ratings_ConsumerId_ApiServiceId",
                schema: "Analytics",
                table: "Ratings",
                columns: new[] { "ConsumerId", "ApiServiceId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiServiceStats",
                schema: "Analytics");

            migrationBuilder.DropTable(
                name: "EndpointStats",
                schema: "Analytics");

            migrationBuilder.DropTable(
                name: "Ratings",
                schema: "Analytics");
        }
    }
}
