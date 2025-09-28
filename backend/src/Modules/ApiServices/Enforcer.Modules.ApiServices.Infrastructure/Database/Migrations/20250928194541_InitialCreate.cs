using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.ApiServices.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "ApiServices");

            migrationBuilder.CreateTable(
                name: "OpenApiDocumentations",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Documentation = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OpenApiDocumentations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlanFeatures",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlanFeatures", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApiServices",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ServiceKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TargetBaseUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ApiDocId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SubscriptionsCount = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiServices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApiServices_OpenApiDocumentations_ApiDocId",
                        column: x => x.ApiDocId,
                        principalSchema: "ApiServices",
                        principalTable: "OpenApiDocumentations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Plans",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: true),
                    BillingPeriod = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuotaLimit = table.Column<int>(type: "int", nullable: false),
                    QuotaResetPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RateLimit = table.Column<int>(type: "int", nullable: false),
                    RateLimitWindow = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FeaturesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    OveragePrice = table.Column<int>(type: "int", nullable: true),
                    MaxOverage = table.Column<int>(type: "int", nullable: true),
                    SubscriptionsCount = table.Column<int>(type: "int", nullable: false),
                    TierLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Plans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Plans_ApiServices_ApiServiceId",
                        column: x => x.ApiServiceId,
                        principalSchema: "ApiServices",
                        principalTable: "ApiServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Plans_PlanFeatures_FeaturesId",
                        column: x => x.FeaturesId,
                        principalSchema: "ApiServices",
                        principalTable: "PlanFeatures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Endpoints",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HTTPMethod = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PublicPath = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TargetPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RateLimit = table.Column<int>(type: "int", nullable: true),
                    RateLimitWindow = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Endpoints", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Endpoints_ApiServices_ApiServiceId",
                        column: x => x.ApiServiceId,
                        principalSchema: "ApiServices",
                        principalTable: "ApiServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Endpoints_Plans_PlanId",
                        column: x => x.PlanId,
                        principalSchema: "ApiServices",
                        principalTable: "Plans",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Subscriptions",
                schema: "ApiServices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConsumerId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PlanId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiServiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ApiKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SubscribedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsCanceled = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subscriptions_ApiServices_ApiServiceId",
                        column: x => x.ApiServiceId,
                        principalSchema: "ApiServices",
                        principalTable: "ApiServices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Subscriptions_Plans_PlanId",
                        column: x => x.PlanId,
                        principalSchema: "ApiServices",
                        principalTable: "Plans",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApiServices_ApiDocId",
                schema: "ApiServices",
                table: "ApiServices",
                column: "ApiDocId",
                unique: true,
                filter: "[ApiDocId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ApiServices_Name",
                schema: "ApiServices",
                table: "ApiServices",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ApiServices_ServiceKey",
                schema: "ApiServices",
                table: "ApiServices",
                column: "ServiceKey",
                unique: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Endpoints_PlanId",
                schema: "ApiServices",
                table: "Endpoints",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Plans_ApiServiceId_TierLevel",
                schema: "ApiServices",
                table: "Plans",
                columns: new[] { "ApiServiceId", "TierLevel" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Plans_FeaturesId",
                schema: "ApiServices",
                table: "Plans",
                column: "FeaturesId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ApiKey",
                schema: "ApiServices",
                table: "Subscriptions",
                column: "ApiKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ApiServiceId",
                schema: "ApiServices",
                table: "Subscriptions",
                column: "ApiServiceId");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_ConsumerId_PlanId",
                schema: "ApiServices",
                table: "Subscriptions",
                columns: new[] { "ConsumerId", "PlanId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_PlanId",
                schema: "ApiServices",
                table: "Subscriptions",
                column: "PlanId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Endpoints",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "Subscriptions",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "Plans",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "ApiServices",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "PlanFeatures",
                schema: "ApiServices");

            migrationBuilder.DropTable(
                name: "OpenApiDocumentations",
                schema: "ApiServices");
        }
    }
}
