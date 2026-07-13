using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public record DeleteWorkShiftRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int Id { get; init; }
}
