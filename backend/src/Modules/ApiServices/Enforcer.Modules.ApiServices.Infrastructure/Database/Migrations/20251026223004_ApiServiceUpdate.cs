using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ApiServiceUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Subscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "Subscriptions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "QuotaUsages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "QuotaUsages",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Plans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "Plans",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "PlanFeatures",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "PlanFeatures",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "OpenApiDocumentations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "OpenApiDocumentations",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Endpoints",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "Endpoints",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "ApiServices",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "CreatorId",
                schema: "ApiServices",
                table: "ApiServices",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiServices",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "ApiKeyBlacklist",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiKeyBlacklist",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "QuotaUsages");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "QuotaUsages");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "PlanFeatures");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "PlanFeatures");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "OpenApiDocumentations");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "OpenApiDocumentations");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "Endpoints");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "Endpoints");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "ApiServices");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                schema: "ApiServices",
                table: "ApiServices");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiServices");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                schema: "ApiServices",
                table: "ApiKeyBlacklist");

            migrationBuilder.DropColumn(
                name: "Updated",
                schema: "ApiServices",
                table: "ApiKeyBlacklist");
        }
    }
}
