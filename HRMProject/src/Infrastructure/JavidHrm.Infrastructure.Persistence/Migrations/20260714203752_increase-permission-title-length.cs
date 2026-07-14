using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JavidHrm.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class increasepermissiontitlelength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Permission",
                type: "NVARCHAR(150)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(40)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Permission",
                type: "NVARCHAR(40)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(150)");
        }
    }
}
