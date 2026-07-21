using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JavidHrm.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class fdb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LeaveTypeDefinition",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(type: "VARCHAR(12)", nullable: false),
                    Name = table.Column<string>(type: "NVARCHAR(50)", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR(300)", nullable: true),
                    Category = table.Column<int>(type: "int", nullable: false),
                    Unit = table.Column<int>(type: "int", nullable: false),
                    IsPaid = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AffectsLeaveBalance = table.Column<bool>(type: "bit", nullable: false),
                    RequiresApproval = table.Column<bool>(type: "bit", nullable: false),
                    DefaultAnnualAllowance = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: true),
                    MaxPerYear = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: true),
                    MaxPerRequest = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: true),
                    MinNoticeDays = table.Column<int>(type: "int", nullable: true),
                    AllowNegativeBalance = table.Column<bool>(type: "bit", nullable: false),
                    CarryForwardEnabled = table.Column<bool>(type: "bit", nullable: false),
                    MaxCarryForwardDays = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: true),
                    IncludeWeekends = table.Column<bool>(type: "bit", nullable: false),
                    IncludeHolidays = table.Column<bool>(type: "bit", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    Color = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveTypeDefinition", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Permission",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "NVARCHAR(150)", nullable: false),
                    Url = table.Column<string>(type: "VARCHAR(100)", nullable: false),
                    NameSpace = table.Column<string>(type: "VARCHAR(150)", nullable: false),
                    ParentId = table.Column<int>(type: "int", nullable: true),
                    LevelTypeId = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Permission_Permission_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Permission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Role",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "NVARCHAR(20)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    BypassContentPolicy = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    RequireContentPolicy = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Role", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserName = table.Column<string>(type: "VARCHAR(30)", nullable: false),
                    FirstName = table.Column<string>(type: "NVARCHAR(20)", nullable: true),
                    LastName = table.Column<string>(type: "NVARCHAR(20)", nullable: true),
                    Email = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PhoneNumber = table.Column<string>(type: "VARCHAR(11)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    LoginPermission = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "VARCHAR(256)", nullable: false),
                    Gender = table.Column<byte>(type: "tinyint", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LastLoginDateOnUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false),
                    SecurityStamp = table.Column<string>(type: "VARCHAR(40)", nullable: false),
                    PeriodEnd = table.Column<DateTime>(type: "datetime2", nullable: false)
                        .Annotation("SqlServer:TemporalIsPeriodEndColumn", true),
                    PeriodStart = table.Column<DateTime>(type: "datetime2", nullable: false)
                        .Annotation("SqlServer:TemporalIsPeriodStartColumn", true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                })
                .Annotation("SqlServer:IsTemporal", true)
                .Annotation("SqlServer:TemporalHistoryTableName", "UserHistory")
                .Annotation("SqlServer:TemporalHistoryTableSchema", null)
                .Annotation("SqlServer:TemporalPeriodEndColumnName", "PeriodEnd")
                .Annotation("SqlServer:TemporalPeriodStartColumnName", "PeriodStart");

            migrationBuilder.CreateTable(
                name: "WebSiteSetting",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "VARCHAR(11)", nullable: true),
                    Telephone = table.Column<string>(type: "VARCHAR(11)", nullable: true),
                    Address = table.Column<string>(type: "VARCHAR(150)", nullable: true),
                    CartNumber = table.Column<string>(type: "VARCHAR(16)", nullable: true),
                    EmailUserName = table.Column<string>(type: "VARCHAR(30)", nullable: true),
                    EmailPassword = table.Column<string>(type: "VARCHAR(30)", nullable: true),
                    SmsAccountUrl = table.Column<string>(type: "VARCHAR(50)", nullable: true),
                    SmsAccountUserName = table.Column<string>(type: "VARCHAR(20)", nullable: true),
                    SmsAccountPassword = table.Column<string>(type: "VARCHAR(20)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebSiteSetting", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WorkShift",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "NVARCHAR(100)", nullable: false),
                    StartTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    EndTime = table.Column<TimeOnly>(type: "time", nullable: false),
                    BreakMinutes = table.Column<int>(type: "int", nullable: false),
                    GraceMinutes = table.Column<int>(type: "int", nullable: false),
                    EarlyLeaveGraceMinutes = table.Column<int>(type: "int", nullable: false),
                    IsOvernight = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR(500)", nullable: true),
                    Color = table.Column<string>(type: "VARCHAR(20)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkShift", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermission",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: false),
                    PermissionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RolePermission_Permission_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permission",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RolePermission_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BackupJob",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FileName = table.Column<string>(type: "NVARCHAR(260)", nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    Type = table.Column<byte>(type: "tinyint", nullable: false),
                    StoragePath = table.Column<string>(type: "NVARCHAR(500)", nullable: false),
                    ErrorMessage = table.Column<string>(type: "NVARCHAR(2000)", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CompletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BackupJob", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BackupJob_User_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ContentPolicy",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    EntityType = table.Column<string>(type: "VARCHAR(100)", unicode: false, maxLength: 100, nullable: false),
                    QueryAction = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    Name = table.Column<string>(type: "NVARCHAR(100)", nullable: false),
                    Effect = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    MergeMode = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentPolicy", x => x.Id);
                    table.CheckConstraint("CK_ContentPolicy_Scope", "([RoleId] IS NOT NULL AND [UserId] IS NULL) OR ([RoleId] IS NULL AND [UserId] IS NOT NULL)");
                    table.ForeignKey(
                        name: "FK_ContentPolicy_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ContentPolicy_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    Message = table.Column<string>(type: "NVARCHAR(1000)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    ReadAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LinkPath = table.Column<string>(type: "NVARCHAR(500)", nullable: true),
                    IconName = table.Column<string>(type: "NVARCHAR(100)", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notification_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TodoItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR(2000)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Priority = table.Column<byte>(type: "tinyint", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    CompletedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TodoItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TodoItem_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRole",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    RoleId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRole", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRole_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRole_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSession",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CurrentJwtId = table.Column<string>(type: "VARCHAR(40)", nullable: false),
                    IpAddress = table.Column<string>(type: "VARCHAR(45)", nullable: true),
                    UserAgent = table.Column<string>(type: "VARCHAR(512)", nullable: true),
                    DeviceName = table.Column<string>(type: "NVARCHAR(100)", nullable: true),
                    DeviceType = table.Column<int>(type: "int", nullable: false),
                    OperatingSystem = table.Column<int>(type: "int", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastSeenOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiresOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsRevoked = table.Column<bool>(type: "bit", nullable: false),
                    RevokedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RevokedReason = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSession", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSession_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Department",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ParentDepartmentId = table.Column<int>(type: "int", nullable: true),
                    DefaultWorkShiftId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "NVARCHAR(30)", nullable: false),
                    Code = table.Column<string>(type: "VARCHAR(12)", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR(300)", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Department", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Department_Department_ParentDepartmentId",
                        column: x => x.ParentDepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Department_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Department_WorkShift_DefaultWorkShiftId",
                        column: x => x.DefaultWorkShiftId,
                        principalTable: "WorkShift",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ContentPolicyRecordAccess",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentPolicyRecordAccess", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContentPolicyRecordAccess_ContentPolicy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "ContentPolicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContentPolicyRule",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    RuleGroup = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    FieldPath = table.Column<string>(type: "VARCHAR(150)", nullable: false),
                    Operator = table.Column<int>(type: "int", nullable: false),
                    ValueType = table.Column<int>(type: "int", nullable: false),
                    Value = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContentPolicyRule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContentPolicyRule_ContentPolicy_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "ContentPolicy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RefreshToken",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JwtId = table.Column<string>(type: "VARCHAR(40)", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExpiredDateOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Used = table.Column<bool>(type: "bit", nullable: false),
                    Invalidated = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserSessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshToken", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RefreshToken_UserSession_UserSessionId",
                        column: x => x.UserSessionId,
                        principalTable: "UserSession",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RefreshToken_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Announcement",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    Content = table.Column<string>(type: "NVARCHAR(4000)", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    Audience = table.Column<byte>(type: "tinyint", nullable: false),
                    Channel = table.Column<byte>(type: "tinyint", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: true),
                    RoleId = table.Column<int>(type: "int", nullable: true),
                    ScheduledAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PublishedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedByUserId = table.Column<int>(type: "int", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcement", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Announcement_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Announcement_Role_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Role",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Announcement_User_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CalendarEvent",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "NVARCHAR(200)", nullable: false),
                    Description = table.Column<string>(type: "NVARCHAR(2000)", nullable: true),
                    StartAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndAtUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAllDay = table.Column<bool>(type: "bit", nullable: false),
                    EventType = table.Column<byte>(type: "tinyint", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    DepartmentId = table.Column<int>(type: "int", nullable: true),
                    Color = table.Column<string>(type: "NVARCHAR(20)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CalendarEvent", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CalendarEvent_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CalendarEvent_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Employee",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DepartmentId = table.Column<int>(type: "int", nullable: false),
                    ManagerId = table.Column<int>(type: "int", nullable: true),
                    WorkShiftId = table.Column<int>(type: "int", nullable: true),
                    EmployeeCode = table.Column<string>(type: "VARCHAR(20)", nullable: false),
                    JobTitle = table.Column<string>(type: "NVARCHAR(80)", nullable: false),
                    HireDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employee", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employee_Department_DepartmentId",
                        column: x => x.DepartmentId,
                        principalTable: "Department",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_Employee_ManagerId",
                        column: x => x.ManagerId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Employee_WorkShift_WorkShiftId",
                        column: x => x.WorkShiftId,
                        principalTable: "WorkShift",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "AttendanceRecord",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    WorkDate = table.Column<DateTime>(type: "date", nullable: false),
                    WorkShiftId = table.Column<int>(type: "int", nullable: true),
                    CheckInUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CheckOutUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    LateMinutes = table.Column<int>(type: "int", nullable: false),
                    EarlyLeaveMinutes = table.Column<int>(type: "int", nullable: false),
                    OvertimeMinutes = table.Column<int>(type: "int", nullable: false),
                    WorkedMinutes = table.Column<int>(type: "int", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttendanceRecord", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AttendanceRecord_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AttendanceRecord_WorkShift_WorkShiftId",
                        column: x => x.WorkShiftId,
                        principalTable: "WorkShift",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "EmployeeShiftSchedule",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    WorkShiftId = table.Column<int>(type: "int", nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "date", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "date", nullable: true),
                    Note = table.Column<string>(type: "NVARCHAR(300)", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeShiftSchedule", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmployeeShiftSchedule_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeShiftSchedule_WorkShift_WorkShiftId",
                        column: x => x.WorkShiftId,
                        principalTable: "WorkShift",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LeaveBalance",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    LeaveTypeDefinitionId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    TotalDays = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false),
                    UsedDays = table.Column<decimal>(type: "decimal(8,2)", precision: 8, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveBalance", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaveBalance_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LeaveBalance_LeaveTypeDefinition_LeaveTypeDefinitionId",
                        column: x => x.LeaveTypeDefinitionId,
                        principalTable: "LeaveTypeDefinition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LeaveRequest",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    LeaveTypeDefinitionId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "NVARCHAR(500)", nullable: false),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CurrentApprovalStepOrder = table.Column<int>(type: "int", nullable: true),
                    TotalApprovalSteps = table.Column<int>(type: "int", nullable: true),
                    SubmittedByUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaveRequest_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LeaveRequest_LeaveTypeDefinition_LeaveTypeDefinitionId",
                        column: x => x.LeaveTypeDefinitionId,
                        principalTable: "LeaveTypeDefinition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PayrollEntry",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    Month = table.Column<int>(type: "int", nullable: false),
                    BaseSalary = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    GrossAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Deductions = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    NetAmount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "NVARCHAR(500)", nullable: true),
                    CreatedOnUtc = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayrollEntry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PayrollEntry_Employee_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "LeaveRequestApprovalStep",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaveRequestId = table.Column<int>(type: "int", nullable: false),
                    StepOrder = table.Column<int>(type: "int", nullable: false),
                    ApproverEmployeeId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "NVARCHAR(500)", nullable: true),
                    ActionedAtUtc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActionedByUserId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LeaveRequestApprovalStep", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LeaveRequestApprovalStep_Employee_ApproverEmployeeId",
                        column: x => x.ApproverEmployeeId,
                        principalTable: "Employee",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_LeaveRequestApprovalStep_LeaveRequest_LeaveRequestId",
                        column: x => x.LeaveRequestId,
                        principalTable: "LeaveRequest",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Permission",
                columns: new[] { "Id", "IsActive", "LevelTypeId", "NameSpace", "ParentId", "Priority", "Title", "Url" },
                values: new object[] { 2, true, 2, "", null, 0, "Manage Users Group", "" });

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_Audience",
                table: "Announcement",
                column: "Audience");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_CreatedByUserId",
                table: "Announcement",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_CreatedOnUtc",
                table: "Announcement",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_DepartmentId",
                table: "Announcement",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_RoleId",
                table: "Announcement",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Announcement_Status",
                table: "Announcement",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_EmployeeId",
                table: "AttendanceRecord",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_EmployeeId_WorkDate",
                table: "AttendanceRecord",
                columns: new[] { "EmployeeId", "WorkDate" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_Status",
                table: "AttendanceRecord",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_WorkDate",
                table: "AttendanceRecord",
                column: "WorkDate");

            migrationBuilder.CreateIndex(
                name: "IX_AttendanceRecord_WorkShiftId",
                table: "AttendanceRecord",
                column: "WorkShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_BackupJob_CreatedByUserId",
                table: "BackupJob",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_BackupJob_CreatedOnUtc",
                table: "BackupJob",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_BackupJob_Status",
                table: "BackupJob",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvent_DepartmentId",
                table: "CalendarEvent",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvent_EndAtUtc",
                table: "CalendarEvent",
                column: "EndAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvent_EventType",
                table: "CalendarEvent",
                column: "EventType");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvent_StartAtUtc",
                table: "CalendarEvent",
                column: "StartAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_CalendarEvent_UserId",
                table: "CalendarEvent",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContentPolicy_RoleId_EntityType_QueryAction_IsActive",
                table: "ContentPolicy",
                columns: new[] { "RoleId", "EntityType", "QueryAction", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_ContentPolicy_UserId_EntityType_QueryAction_IsActive",
                table: "ContentPolicy",
                columns: new[] { "UserId", "EntityType", "QueryAction", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_ContentPolicyRecordAccess_PolicyId",
                table: "ContentPolicyRecordAccess",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_ContentPolicyRecordAccess_PolicyId_EntityId",
                table: "ContentPolicyRecordAccess",
                columns: new[] { "PolicyId", "EntityId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContentPolicyRule_PolicyId",
                table: "ContentPolicyRule",
                column: "PolicyId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_DefaultWorkShiftId",
                table: "Department",
                column: "DefaultWorkShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_Name",
                table: "Department",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Department_ParentDepartmentId",
                table: "Department",
                column: "ParentDepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Department_UserId",
                table: "Department",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_DepartmentId",
                table: "Employee",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_EmployeeCode",
                table: "Employee",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_IsActive",
                table: "Employee",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_ManagerId",
                table: "Employee",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Employee_UserId",
                table: "Employee",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Employee_WorkShiftId",
                table: "Employee",
                column: "WorkShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeShiftSchedule_EmployeeId",
                table: "EmployeeShiftSchedule",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeShiftSchedule_EmployeeId_EffectiveFrom",
                table: "EmployeeShiftSchedule",
                columns: new[] { "EmployeeId", "EffectiveFrom" });

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeShiftSchedule_WorkShiftId",
                table: "EmployeeShiftSchedule",
                column: "WorkShiftId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveBalance_EmployeeId_LeaveTypeDefinitionId_Year",
                table: "LeaveBalance",
                columns: new[] { "EmployeeId", "LeaveTypeDefinitionId", "Year" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveBalance_LeaveTypeDefinitionId",
                table: "LeaveBalance",
                column: "LeaveTypeDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveBalance_Year",
                table: "LeaveBalance",
                column: "Year");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_CurrentApprovalStepOrder",
                table: "LeaveRequest",
                column: "CurrentApprovalStepOrder");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_EmployeeId",
                table: "LeaveRequest",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_EndDate",
                table: "LeaveRequest",
                column: "EndDate");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_LeaveTypeDefinitionId",
                table: "LeaveRequest",
                column: "LeaveTypeDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_StartDate",
                table: "LeaveRequest",
                column: "StartDate");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequest_Status",
                table: "LeaveRequest",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequestApprovalStep_ApproverEmployeeId",
                table: "LeaveRequestApprovalStep",
                column: "ApproverEmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequestApprovalStep_LeaveRequestId",
                table: "LeaveRequestApprovalStep",
                column: "LeaveRequestId");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequestApprovalStep_LeaveRequestId_StepOrder",
                table: "LeaveRequestApprovalStep",
                columns: new[] { "LeaveRequestId", "StepOrder" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveRequestApprovalStep_Status",
                table: "LeaveRequestApprovalStep",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypeDefinition_Category",
                table: "LeaveTypeDefinition",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypeDefinition_Code",
                table: "LeaveTypeDefinition",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypeDefinition_IsActive",
                table: "LeaveTypeDefinition",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypeDefinition_Name",
                table: "LeaveTypeDefinition",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_LeaveTypeDefinition_SortOrder",
                table: "LeaveTypeDefinition",
                column: "SortOrder");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_CreatedOnUtc",
                table: "Notification",
                column: "CreatedOnUtc");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_IsRead",
                table: "Notification",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_Type",
                table: "Notification",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Notification_UserId",
                table: "Notification",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEntry_EmployeeId",
                table: "PayrollEntry",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEntry_EmployeeId_Year_Month",
                table: "PayrollEntry",
                columns: new[] { "EmployeeId", "Year", "Month" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEntry_Month",
                table: "PayrollEntry",
                column: "Month");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEntry_Status",
                table: "PayrollEntry",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_PayrollEntry_Year",
                table: "PayrollEntry",
                column: "Year");

            migrationBuilder.CreateIndex(
                name: "IX_Permission_ParentId",
                table: "Permission",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_JwtId",
                table: "RefreshToken",
                column: "JwtId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserId",
                table: "RefreshToken",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_RefreshToken_UserSessionId",
                table: "RefreshToken",
                column: "UserSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_PermissionId",
                table: "RolePermission",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermission_RoleId",
                table: "RolePermission",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_TodoItem_DueDate",
                table: "TodoItem",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_TodoItem_IsCompleted",
                table: "TodoItem",
                column: "IsCompleted");

            migrationBuilder.CreateIndex(
                name: "IX_TodoItem_UserId",
                table: "TodoItem",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_User_Email",
                table: "User",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_User_UserName",
                table: "User",
                column: "UserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_RoleId",
                table: "UserRole",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRole_UserId",
                table: "UserRole",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSession_UserId",
                table: "UserSession",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSession_UserId_IsRevoked",
                table: "UserSession",
                columns: new[] { "UserId", "IsRevoked" });

            migrationBuilder.CreateIndex(
                name: "IX_WorkShift_IsActive",
                table: "WorkShift",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Announcement");

            migrationBuilder.DropTable(
                name: "AttendanceRecord");

            migrationBuilder.DropTable(
                name: "BackupJob");

            migrationBuilder.DropTable(
                name: "CalendarEvent");

            migrationBuilder.DropTable(
                name: "ContentPolicyRecordAccess");

            migrationBuilder.DropTable(
                name: "ContentPolicyRule");

            migrationBuilder.DropTable(
                name: "EmployeeShiftSchedule");

            migrationBuilder.DropTable(
                name: "LeaveBalance");

            migrationBuilder.DropTable(
                name: "LeaveRequestApprovalStep");

            migrationBuilder.DropTable(
                name: "Notification");

            migrationBuilder.DropTable(
                name: "PayrollEntry");

            migrationBuilder.DropTable(
                name: "RefreshToken");

            migrationBuilder.DropTable(
                name: "RolePermission");

            migrationBuilder.DropTable(
                name: "TodoItem");

            migrationBuilder.DropTable(
                name: "UserRole");

            migrationBuilder.DropTable(
                name: "WebSiteSetting");

            migrationBuilder.DropTable(
                name: "ContentPolicy");

            migrationBuilder.DropTable(
                name: "LeaveRequest");

            migrationBuilder.DropTable(
                name: "UserSession");

            migrationBuilder.DropTable(
                name: "Permission");

            migrationBuilder.DropTable(
                name: "Role");

            migrationBuilder.DropTable(
                name: "Employee");

            migrationBuilder.DropTable(
                name: "LeaveTypeDefinition");

            migrationBuilder.DropTable(
                name: "Department");

            migrationBuilder.DropTable(
                name: "User")
                .Annotation("SqlServer:IsTemporal", true)
                .Annotation("SqlServer:TemporalHistoryTableName", "UserHistory")
                .Annotation("SqlServer:TemporalHistoryTableSchema", null)
                .Annotation("SqlServer:TemporalPeriodEndColumnName", "PeriodEnd")
                .Annotation("SqlServer:TemporalPeriodStartColumnName", "PeriodStart");

            migrationBuilder.DropTable(
                name: "WorkShift");
        }
    }
}
