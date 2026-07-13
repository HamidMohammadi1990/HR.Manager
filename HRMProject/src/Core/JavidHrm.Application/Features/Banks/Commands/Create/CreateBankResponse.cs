using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Banks.Commands;

public record CreateBankResponse
{
    [JsonConverter(typeof(BankEncryptor))]
    public int Id { get; init; }
}
