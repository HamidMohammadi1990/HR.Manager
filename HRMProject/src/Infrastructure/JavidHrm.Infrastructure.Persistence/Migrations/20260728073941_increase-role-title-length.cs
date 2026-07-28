using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JavidHrm.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class increaseroletitlelength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Role",
                type: "NVARCHAR(100)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(20)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Role",
                type: "NVARCHAR(20)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "NVARCHAR(100)");
        }
    }
}
