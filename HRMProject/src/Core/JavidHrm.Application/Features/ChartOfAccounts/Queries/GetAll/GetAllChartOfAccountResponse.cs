using JavidHrm.Domain.Enums;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.ChartOfAccounts.Queries;

public record GetAllChartOfAccountResponse
{
    [JsonConverter(typeof(ChartOfAccountEncryptor))]
    public int Id { get; init; } = default!;

    public int Level { get; set; }

    [JsonConverter(typeof(ChartOfAccountNullableEncryptor))]
    public int? ParentId { get; init; }

    public string AccountCode { get; init; } = default!;
    public string AccountTitle { get; init; } = default!;
    public ChartOfAccountType AccountType { get; init; } = default!;
    public ChartOfAccountDetailType AccountDetailType { get; init; } = default!;
}