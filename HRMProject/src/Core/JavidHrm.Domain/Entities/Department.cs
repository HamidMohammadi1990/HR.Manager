using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class Department : BaseEntity
{
    public int UserId { get; private set; }
    public int CityId { get; private set; }
    public string Name { get; private set; } = default!;
    public string Code { get; private set; } = default!;
    public string PhoneNumber { get; private set; } = default!;
    public string? Email { get; private set; }
    public string PostalCode { get; private set; } = default!;
    public string Address { get; private set; } = default!;
    public string? Description { get; private set; }
    public DateTime CreatedOnUtc { get; private set; } = DateTime.UtcNow;
    public bool IsActive { get; private set; }
    public float Latitude { get; private set; }
    public float Longitude { get; private set; }

    public User User { get; private set; } = default!;
    public City City { get; private set; } = default!;
    public ICollection<FinancialYear> FinancialYears { get; set; } = default!;

    public static Department Create(
        int userId,
        int cityId,
        string name,
        string code,
        string phoneNumber,
        string? email,
        string postalCode,
        string address,
        string? description,
        float latitude,
        float longitude)
        => new()
        {
            Name = name,
            Code = code,
            Email = email,
            UserId = userId,
            CityId = cityId,
            Address = address,
            Latitude = latitude,
            Longitude = longitude,
            PostalCode = postalCode,
            PhoneNumber = phoneNumber,
            Description = description
        };

    public void Update(
        int cityId,
        string name,
        string code,
        string phoneNumber,
        string email,
        string postalCode,
        string address,
        string description,
        float latitude,
        float longitude)
    {
        Name = name;
        Code = code;
        Email = email;
        CityId = cityId;
        Address = address;
        Latitude = latitude;
        Longitude = longitude;
        PostalCode = postalCode;
        PhoneNumber = phoneNumber;
        Description = description;
    }

    public void Active() => IsActive = true;

    public void InActive() => IsActive = false;
}
