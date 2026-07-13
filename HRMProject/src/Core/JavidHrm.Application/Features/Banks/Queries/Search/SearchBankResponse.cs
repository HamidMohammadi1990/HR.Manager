using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Banks.Queries;

public record SearchBankResponse
{
    [JsonConverter(typeof(BankEncryptor))]
    public int Id { get; init; }
    public string Title { get; init; } = default!;
    public string Icon { get; init; } = default!;
}
