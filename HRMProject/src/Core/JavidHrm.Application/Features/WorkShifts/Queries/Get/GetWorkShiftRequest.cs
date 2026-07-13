using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public record GetWorkShiftRequest : IRequest<OperationResult<GetWorkShiftResponse?>>
{
    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int Id { get; init; }
}
