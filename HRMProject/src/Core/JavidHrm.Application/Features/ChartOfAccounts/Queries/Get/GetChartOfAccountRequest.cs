using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public record GetChartOfAccountRequest : IRequest<OperationResult<GetChartOfAccountResponse?>>
{
    [JsonConverter(typeof(ChartOfAccountEncryptor))]
    public int Id { get; init; }
}