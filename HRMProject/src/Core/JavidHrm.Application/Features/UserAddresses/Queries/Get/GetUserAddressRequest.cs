using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.UserAddresses.Queries;

public class GetUserAddressRequest : IRequest<OperationResult<GetUserAddressResponse?>>
{
    [JsonConverter(typeof(UserAddressEncryptor))]
    public int Id { get; init; }
}