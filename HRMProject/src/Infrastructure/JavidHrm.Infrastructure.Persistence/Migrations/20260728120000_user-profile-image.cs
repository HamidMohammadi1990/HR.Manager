using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JavidHrm.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class userprofileimage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "User",
                type: "NVARCHAR(500)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "User");
        }
    }
}
