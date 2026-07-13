namespace JavidHrm.Application.Common.Validation;

/// <summary>
/// String length limits aligned with EF entity configurations (HR platform).
/// </summary>
public static class EntityFieldLengths
{
    public static class Bank
    {
        public const int Name = 30;
        public const int Code = 50;
    }

    public static class ChartOfAccount
    {
        public const int Code = 20;
        public const int Title = 50;
    }

    public static class City
    {
        public const int Name = 25;
        public const int Slug = 30;
        public const int Description = 200;
    }

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
        public const int PhoneNumber = 11;
        public const int Email = 35;
        public const int PostalCode = 10;
        public const int Address = 120;
    }

    public static class Company
    {
        public const int Name = Department.Name;
        public const int Description = Department.Description;
        public const int Code = Department.Code;
        public const int PhoneNumber = Department.PhoneNumber;
        public const int Email = Department.Email;
        public const int PostalCode = Department.PostalCode;
        public const int Address = Department.Address;
    }

    public static class FinancialYear
    {
        public const int Title = 50;
    }

    public static class Permission
    {
        public const int Title = 40;
        public const int Slug = 150;
        public const int GroupName = 100;
    }

    public static class Province
    {
        public const int Name = 25;
        public const int Slug = 30;
        public const int TelPrefix = 6;
        public const int Description = 200;
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
