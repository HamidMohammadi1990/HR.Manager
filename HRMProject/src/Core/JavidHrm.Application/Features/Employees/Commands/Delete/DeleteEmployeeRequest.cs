using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;

namespace JavidHrm.Application.Features.Employees.Commands;

public record DeleteEmployeeRequest : IRequest<OperationResult>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int Id { get; init; }
}
