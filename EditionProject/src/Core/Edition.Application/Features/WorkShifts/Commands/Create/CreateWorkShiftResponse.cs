using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public record CreateWorkShiftResponse
{
    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int Id { get; init; }
}
