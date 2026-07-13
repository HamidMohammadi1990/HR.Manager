using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public record GetPayrollEntryRequest : IRequest<OperationResult<GetPayrollEntryResponse?>>
{
    [JsonConverter(typeof(PayrollEntryEncryptor))]
    public int Id { get; init; }
}
