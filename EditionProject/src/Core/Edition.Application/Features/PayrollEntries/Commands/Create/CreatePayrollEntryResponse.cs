using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public record CreatePayrollEntryResponse
{
    [JsonConverter(typeof(PayrollEntryEncryptor))]
    public int Id { get; init; }
}
