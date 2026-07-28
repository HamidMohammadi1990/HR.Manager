using JavidHrm.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Http;

namespace JavidHrm.Application.Features.Users.Commands;

public record UploadCurrentUserProfileImageRequest(IFormFile File)
    : IRequest<OperationResult<UploadProfileImageResponse>>;
