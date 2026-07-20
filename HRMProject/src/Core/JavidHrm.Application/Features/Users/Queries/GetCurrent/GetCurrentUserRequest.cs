using JavidHrm.Common.Models;
using MediatR;

namespace JavidHrm.Application.Features.Users.Queries;

public record GetCurrentUserRequest : IRequest<OperationResult<GetUserResponse?>>;
