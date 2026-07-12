using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.ChartOfAccounts.Commands;

public record DeleteChartOfAccountRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(ChartOfAccountEncryptor))]
    public int Id { get; init; }
}