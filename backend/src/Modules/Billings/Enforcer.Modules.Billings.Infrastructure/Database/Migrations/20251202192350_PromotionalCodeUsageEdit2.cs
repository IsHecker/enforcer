using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class PromotionalCodeUsageEdit2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PromotionalCodeUsages_Invoices_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages");

            migrationBuilder.DropIndex(
                name: "IX_PromotionalCodeUsages_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionalCodeUsages_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages",
                column: "PromoCodeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_PromotionalCodeUsages_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages");

            migrationBuilder.CreateIndex(
                name: "IX_PromotionalCodeUsages_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages",
                column: "PromoCodeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionalCodeUsages_Invoices_PromoCodeId",
                schema: "Billings",
                table: "PromotionalCodeUsages",
                column: "PromoCodeId",
                principalSchema: "Billings",
                principalTable: "Invoices",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
