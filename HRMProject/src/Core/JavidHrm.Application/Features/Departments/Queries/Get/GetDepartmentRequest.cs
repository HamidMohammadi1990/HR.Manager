using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Departments.Queries;

public record GetDepartmentRequest : IRequest<OperationResult<GetDepartmentResponse?>>
{
    [JsonConverter(typeof(DepartmentEncryptor))]
    public int Id { get; init; }
}
