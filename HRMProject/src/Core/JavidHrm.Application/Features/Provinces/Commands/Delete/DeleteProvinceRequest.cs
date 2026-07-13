using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Provinces.Commands;

public record DeleteProvinceRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(ProvinceEncryptor))]
    public int Id { get; init; }
}