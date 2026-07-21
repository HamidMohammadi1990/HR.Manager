using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

public record CreateLeaveTypeDefinitionResponse
{
    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int Id { get; init; }
}
