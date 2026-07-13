using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class User : BaseEntity
{
    public string UserName { get; private set; } = default!;
    public string? FirstName { get; private set; }
    public string? LastName { get; private set; }
    public string? Email { get; private set; }
    public bool EmailConfirmed { get; private set; }
    public string? PhoneNumber { get; private set; }
    public bool PhoneNumberConfirmed { get; private set; }
    public bool LoginPermission { get; private set; }
    public string PasswordHash { get; private set; } = null!;
    public GenderType? Gender { get; private set; }
    public bool IsActive { get; private set; } = true;
    public DateTime? LastLoginDateOnUtc { get; private set; }
    public int AccessFailedCount { get; private set; }
    public string SecurityStamp { get; private set; } = null!;
    public int? CityId { get; private set; }

    public City City { get; private set; } = default!;
    public ICollection<Department> Departments { get; private set; } = default!;
    public ICollection<UserRole> UserRoles { get; private set; } = default!;
    public ICollection<UserAddress> UserAddresses { get; private set; } = default!;
    public ICollection<RefreshToken> RefreshTokens { get; private set; } = default!;
    public ICollection<UserSession> UserSessions { get; private set; } = default!;

    public static User Create(
        string email,
        int cityId,
        GenderType gender,
        string username,
        string firstName,
        string lastName,
        string phoneNumber,
        string passwordHash,
        string securityStamp)
        => new()
        {
            Email = email,
            CityId = cityId,
            Gender = gender,
            UserName = username,
            LastName = lastName,
            FirstName = firstName,
            PhoneNumber = phoneNumber,
            PasswordHash = passwordHash,
            SecurityStamp = securityStamp
        };

    public static User Create(string userName, string? email, string? phoneNumber)
        => new()
        {
            Email = email,
            UserName = userName,
            PhoneNumber = phoneNumber
        };

    public User SetUserRoles(List<UserRole> userRoles)
    {
        UserRoles = userRoles;
        return this;
    }

    public void UpdateEmail(string email) => Email = email;

    public void UpdateUserName(string userName) => UserName = userName;

    public void UpdatePassword(string passwordHash)
    {
        PasswordHash = passwordHash;
        SecurityStamp = Guid.NewGuid().ToString("N");
    }

    public void UpdatePhoneNumber(string phoneNumber) => PhoneNumber = phoneNumber;

    public void ConfirmEmail() => EmailConfirmed = true;

    public void ConfirmPhoneNumber() => PhoneNumberConfirmed = true;

    public void Update(
        string userName,
        string firstName,
        string lastName,
        string? email,
        string phoneNumber,
        int cityId,
        GenderType gender,
        bool isActive,
        bool loginPermission)
    {
        UserName = userName;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        PhoneNumber = phoneNumber;
        CityId = cityId;
        Gender = gender;
        IsActive = isActive;
        LoginPermission = loginPermission;
    }

    public void GrantLoginPermission() => LoginPermission = true;

    public void Deactivate() => IsActive = false;
}
