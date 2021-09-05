using Microsoft.EntityFrameworkCore.Migrations;

namespace FileWebApplication.Migrations
{
    public partial class AddSize : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "size",
                table: "Files",
                newName: "Size");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Size",
                table: "Files",
                newName: "size");
        }
    }
}
