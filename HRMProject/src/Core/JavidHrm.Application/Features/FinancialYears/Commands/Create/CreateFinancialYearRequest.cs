using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.FinancialYears.Commands;

public record CreateFinancialYearRequest : IRequest<OperationResult<CreateFinancialYearResponse>>
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int DepartmentId { get; init; }

    public string Name { get; init; } = default!;
    public DateTime StartDate { get; init; }
    public DateTime EndDate { get; init; }
}