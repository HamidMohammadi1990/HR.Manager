using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.FinancialYears.Commands;

public record DeleteFinancialYearRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(FinancialYearEncryptor))]
    public int Id { get; init; }
}