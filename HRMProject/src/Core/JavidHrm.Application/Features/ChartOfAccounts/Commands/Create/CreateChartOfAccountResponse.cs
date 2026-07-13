using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.ChartOfAccounts.Commands;

public record CreateChartOfAccountResponse()
{
    [JsonConverter(typeof(ChartOfAccountEncryptor))]
    public int Id { get; init; }
}