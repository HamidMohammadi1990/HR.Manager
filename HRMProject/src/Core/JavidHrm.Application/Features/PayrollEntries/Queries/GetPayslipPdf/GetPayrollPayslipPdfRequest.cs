using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public record GetPayrollPayslipPdfRequest : IRequest<OperationResult<GetPayrollPayslipPdfResponse>>
{
    [JsonConverter(typeof(PayrollEntryEncryptor))]
    public int Id { get; init; }
}
