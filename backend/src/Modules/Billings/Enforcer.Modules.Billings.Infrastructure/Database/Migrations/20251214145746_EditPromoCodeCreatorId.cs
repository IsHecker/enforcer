using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EditPromoCodeCreatorId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                schema: "Billings",
                table: "PromotionalCodes",
                newName: "CreatorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatorId",
                schema: "Billings",
                table: "PromotionalCodes",
                newName: "CreatedBy");
        }
    }
}
