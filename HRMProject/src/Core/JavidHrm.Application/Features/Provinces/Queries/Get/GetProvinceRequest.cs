using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Provinces.Queries;

public record GetProvinceRequest : IRequest<OperationResult<GetProvinceResponse>>
{
    [JsonConverter(typeof(ProvinceEncryptor))]
    public int Id { get; init; }
}