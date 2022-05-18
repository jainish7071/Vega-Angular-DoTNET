using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace vega.Migrations
{
    public partial class AddPhotoBugFix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FilteName",
                table: "Photos",
                newName: "FileName");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "FileName",
                table: "Photos",
                newName: "FilteName");
        }
    }
}
