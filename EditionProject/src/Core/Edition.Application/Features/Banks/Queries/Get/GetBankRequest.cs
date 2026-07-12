using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Banks.Queries;

public record GetBankRequest : IRequest<OperationResult<GetBankResponse?>>
{
    [JsonConverter(typeof(BankEncryptor))]
    public int Id { get; init; }
}
