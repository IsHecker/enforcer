using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ApiKeyBan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiKeyBlacklist",
                schema: "ApiServices");

            migrationBuilder.CreateTable(
                name: "ApiKeyBans",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    BannedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BannedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiKeyBans", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApiKeyBans_ApiKey",
                schema: "ApiServices",
                table: "ApiKeyBans",
                column: "ApiKey");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApiKeyBans",
                schema: "ApiServices");

            migrationBuilder.CreateTable(
                name: "ApiKeyBlacklist",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BannedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    BannedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Duration = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiKeyBlacklist", x => x.Id);
                });
        }
    }
}
