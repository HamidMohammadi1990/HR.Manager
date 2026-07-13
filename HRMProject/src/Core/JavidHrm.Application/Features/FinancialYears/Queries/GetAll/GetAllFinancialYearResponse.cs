using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public record GetAllFinancialYearResponse
{
    [JsonConverter(typeof(FinancialYearEncryptor))]
    public int Id { get; set; } = default!;

    public string Name { get; set; } = default!;
    public DateTime StartDate { get; set; } = default!;
    public DateTime EndDate { get; set; } = default!;
    public bool IsActive { get; set; }

    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; set; } = default!;

    public DateTime CreatedOnUtc { get; set; }
}