using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Cities.Commands;

public record CreateCityResponse
{
    [JsonConverter(typeof(CityEncryptor))]
    public int Id { get; init; }
}