using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Commands;

public class DeleteUserAddressRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(UserAddressEncryptor))]
    public int Id { get; init; }
}