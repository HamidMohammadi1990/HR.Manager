using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.LeaveTypeDefinitions.Queries;

public record GetLeaveTypeDefinitionRequest : IRequest<OperationResult<GetLeaveTypeDefinitionResponse?>>
{
    [JsonConverter(typeof(LeaveTypeDefinitionEncryptor))]
    public int Id { get; init; }
}
