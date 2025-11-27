using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InvoiceUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountAmount",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "OverageCharges",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "PromoCodeApplied",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Subtotal",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TaxAmount",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TotalAmount",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "PlanId",
                schema: "Billings",
                table: "Invoices",
                newName: "ConsumerId");

            migrationBuilder.RenameColumn(
                name: "PaidDate",
                schema: "Billings",
                table: "Invoices",
                newName: "PaidAt");

            migrationBuilder.RenameColumn(
                name: "IssueDate",
                schema: "Billings",
                table: "Invoices",
                newName: "IssuedAt");

            migrationBuilder.RenameColumn(
                name: "DueDate",
                schema: "Billings",
                table: "Invoices",
                newName: "DueAt");

            migrationBuilder.AddColumn<long>(
                name: "DiscountTotal",
                schema: "Billings",
                table: "Invoices",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<Guid>(
                name: "SubscriptionId",
                schema: "Billings",
                table: "Invoices",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "TaxTotal",
                schema: "Billings",
                table: "Invoices",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<long>(
                name: "Total",
                schema: "Billings",
                table: "Invoices",
                type: "bigint",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "InvoiceLineItems",
                schema: "Billings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InvoiceId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Quantity = table.Column<long>(type: "bigint", nullable: false),
                    UnitPrice = table.Column<long>(type: "bigint", nullable: false),
                    TotalAmount = table.Column<long>(type: "bigint", nullable: false),
                    PeriodStart = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PeriodEnd = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceLineItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InvoiceLineItems_Invoices_InvoiceId",
                        column: x => x.InvoiceId,
                        principalSchema: "Billings",
                        principalTable: "Invoices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceLineItems_InvoiceId",
                schema: "Billings",
                table: "InvoiceLineItems",
                column: "InvoiceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InvoiceLineItems",
                schema: "Billings");

            migrationBuilder.DropColumn(
                name: "DiscountTotal",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "SubscriptionId",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TaxTotal",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "Total",
                schema: "Billings",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "PaidAt",
                schema: "Billings",
                table: "Invoices",
                newName: "PaidDate");

            migrationBuilder.RenameColumn(
                name: "IssuedAt",
                schema: "Billings",
                table: "Invoices",
                newName: "IssueDate");

            migrationBuilder.RenameColumn(
                name: "DueAt",
                schema: "Billings",
                table: "Invoices",
                newName: "DueDate");

            migrationBuilder.RenameColumn(
                name: "ConsumerId",
                schema: "Billings",
                table: "Invoices",
                newName: "PlanId");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount",
                schema: "Billings",
                table: "Invoices",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OverageCharges",
                schema: "Billings",
                table: "Invoices",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "PromoCodeApplied",
                schema: "Billings",
                table: "Invoices",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Subtotal",
                schema: "Billings",
                table: "Invoices",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TaxAmount",
                schema: "Billings",
                table: "Invoices",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAmount",
                schema: "Billings",
                table: "Invoices",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
