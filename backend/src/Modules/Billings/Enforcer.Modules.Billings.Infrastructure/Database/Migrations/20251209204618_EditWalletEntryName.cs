using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Enforcer.Modules.Billings.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class EditWalletEntryName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntry_Wallets_WalletId",
                schema: "Billings",
                table: "WalletEntry");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletEntry",
                schema: "Billings",
                table: "WalletEntry");

            migrationBuilder.RenameTable(
                name: "WalletEntry",
                schema: "Billings",
                newName: "WalletEntries",
                newSchema: "Billings");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntry_WalletId",
                schema: "Billings",
                table: "WalletEntries",
                newName: "IX_WalletEntries_WalletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletEntries",
                schema: "Billings",
                table: "WalletEntries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntries_Wallets_WalletId",
                schema: "Billings",
                table: "WalletEntries",
                column: "WalletId",
                principalSchema: "Billings",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletEntries_Wallets_WalletId",
                schema: "Billings",
                table: "WalletEntries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_WalletEntries",
                schema: "Billings",
                table: "WalletEntries");

            migrationBuilder.RenameTable(
                name: "WalletEntries",
                schema: "Billings",
                newName: "WalletEntry",
                newSchema: "Billings");

            migrationBuilder.RenameIndex(
                name: "IX_WalletEntries_WalletId",
                schema: "Billings",
                table: "WalletEntry",
                newName: "IX_WalletEntry_WalletId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_WalletEntry",
                schema: "Billings",
                table: "WalletEntry",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletEntry_Wallets_WalletId",
                schema: "Billings",
                table: "WalletEntry",
                column: "WalletId",
                principalSchema: "Billings",
                principalTable: "Wallets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
