using Microsoft.EntityFrameworkCore.Migrations;

namespace FileWebApplication.Migrations
{
    public partial class Addsavename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SaveName",
                table: "Files",
                type: "nvarchar(100)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SaveName",
                table: "Files");
        }
    }
}
