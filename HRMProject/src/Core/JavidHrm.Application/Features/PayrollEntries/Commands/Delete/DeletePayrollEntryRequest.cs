using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.PayrollEntries.Commands;

public record DeletePayrollEntryRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(PayrollEntryEncryptor))]
    public int Id { get; init; }
}
