using JavidHrm.Common.Models;
using MediatR;

namespace JavidHrm.Application.Features.Employees.Queries;

public record GetCurrentEmployeeRequest : IRequest<OperationResult<GetCurrentEmployeeResponse?>>;
