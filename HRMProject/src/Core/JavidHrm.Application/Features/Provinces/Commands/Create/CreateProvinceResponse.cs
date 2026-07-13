using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Provinces.Commands;

public record CreateProvinceResponse
{
    [JsonConverter(typeof(ProvinceEncryptor))]
    public int Id { get; init; }
}