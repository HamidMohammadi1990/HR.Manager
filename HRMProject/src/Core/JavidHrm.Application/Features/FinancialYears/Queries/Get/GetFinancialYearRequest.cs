using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.FinancialYears.Queries;

public record GetFinancialYearRequest : IRequest<OperationResult<GetFinancialYearResponse?>>
{
    [JsonConverter(typeof(FinancialYearEncryptor))]
    public int Id { get; init; }
}