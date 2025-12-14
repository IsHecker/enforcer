using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class RandomEdits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransactionCount",
                schema: "Billings",
                table: "Payouts");

            migrationBuilder.DropColumn(
                name: "LastPaymentAttempt",
                schema: "Billings",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "RetryCount",
                schema: "Billings",
                table: "Payments");

            migrationBuilder.AlterColumn<long>(
                name: "RefundedAmount",
                schema: "Billings",
                table: "Payments",
                type: "bigint",
                precision: 18,
                scale: 2,
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldPrecision: 18,
                oldScale: 2);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TransactionCount",
                schema: "Billings",
                table: "Payouts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<long>(
                name: "RefundedAmount",
                schema: "Billings",
                table: "Payments",
                type: "bigint",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldPrecision: 18,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastPaymentAttempt",
                schema: "Billings",
                table: "Payments",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RetryCount",
                schema: "Billings",
                table: "Payments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
