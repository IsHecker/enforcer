using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EditPaymentMethod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CardLastFourNumbers",
                schema: "Billings",
                table: "PaymentMethods",
                newName: "CardLast4");

            migrationBuilder.AlterColumn<long>(
                name: "CardExpYear",
                schema: "Billings",
                table: "PaymentMethods",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "CardExpMonth",
                schema: "Billings",
                table: "PaymentMethods",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CardLast4",
                schema: "Billings",
                table: "PaymentMethods",
                newName: "CardLastFourNumbers");

            migrationBuilder.AlterColumn<int>(
                name: "CardExpYear",
                schema: "Billings",
                table: "PaymentMethods",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CardExpMonth",
                schema: "Billings",
                table: "PaymentMethods",
                type: "int",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);
        }
    }
}
