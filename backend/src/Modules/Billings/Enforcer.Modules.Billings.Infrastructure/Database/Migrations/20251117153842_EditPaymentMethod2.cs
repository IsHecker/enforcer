using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EditPaymentMethod2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "StripePaymentMethodId",
                schema: "Billings",
                table: "PaymentMethods",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Fingerprint",
                schema: "Billings",
                table: "PaymentMethods",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_ConsumerId",
                schema: "Billings",
                table: "PaymentMethods",
                column: "ConsumerId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_ConsumerId_Fingerprint",
                schema: "Billings",
                table: "PaymentMethods",
                columns: new[] { "ConsumerId", "Fingerprint" },
                unique: true,
                filter: "[Fingerprint] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentMethods_StripePaymentMethodId",
                schema: "Billings",
                table: "PaymentMethods",
                column: "StripePaymentMethodId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_ConsumerId",
                schema: "Billings",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_ConsumerId_Fingerprint",
                schema: "Billings",
                table: "PaymentMethods");

            migrationBuilder.DropIndex(
                name: "IX_PaymentMethods_StripePaymentMethodId",
                schema: "Billings",
                table: "PaymentMethods");

            migrationBuilder.DropColumn(
                name: "Fingerprint",
                schema: "Billings",
                table: "PaymentMethods");

            migrationBuilder.AlterColumn<string>(
                name: "StripePaymentMethodId",
                schema: "Billings",
                table: "PaymentMethods",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
