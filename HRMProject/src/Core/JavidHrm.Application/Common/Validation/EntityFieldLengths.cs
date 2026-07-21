namespace JavidHrm.Application.Common.Validation;

/// <summary>
/// String length limits aligned with EF entity configurations (HR platform).
/// </summary>
public static class EntityFieldLengths
{
    public static class ContentPolicy
    {
        public const int Name = 100;
        public const int EntityType = 100;
        public const int QueryAction = 100;
    }

    public static class ContentPolicyRule
    {
        public const int FieldPath = 150;
        public const int Value = 200;
    }

    public static class Department
    {
        public const int Name = 30;
        public const int Description = 300;
        public const int Code = 12;
    }

    public static class LeaveTypeDefinition
    {
        public const int Code = 12;
        public const int Name = 50;
        public const int Description = 300;
        public const int Color = 20;
    }

    public static class Permission
    {
        public const int Title = 40;
        public const int Slug = 150;
        public const int GroupName = 100;
    }

    public static class Role
    {
        public const int Name = 20;
    }

    public static class User
    {
        public const int FirstName = 20;
        public const int LastName = 20;
        public const int UserName = 50;
        public const int Email = 30;
        public const int PasswordHash = 256;
        public const int Mobile = 11;
        public const int NationalCode = 20;
        public const int Address = 40;
    }
}
