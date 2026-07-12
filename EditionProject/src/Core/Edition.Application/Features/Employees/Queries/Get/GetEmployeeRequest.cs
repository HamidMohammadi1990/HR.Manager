using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Queries;

public record GetEmployeeRequest : IRequest<OperationResult<GetEmployeeResponse?>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int Id { get; init; }
}
