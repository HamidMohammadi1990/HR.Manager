namespace JavidHrm.Domain.Dtos.Departments;

public class SearchDepartmentResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public int CityId { get; set; }
    public string CityName { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string? Email { get; set; }
    public float Latitude { get; set; }
    public float Longitude { get; set; }
    public string PhoneNumber { get; set; } = default!;
    public string PostalCode { get; set; } = default!;
    public int ProvinceId { get; set; }
    public string ProvinceName { get; set; } = default!;
    public int UserId { get; set; }
    public string? UserFirstName { get; set; }
    public string? UserLastName { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
