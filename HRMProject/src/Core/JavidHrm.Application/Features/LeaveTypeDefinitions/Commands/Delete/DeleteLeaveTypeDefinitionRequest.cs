using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Commands;

public record DeleteLeaveTypeDefinitionRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int Id { get; init; }
}
