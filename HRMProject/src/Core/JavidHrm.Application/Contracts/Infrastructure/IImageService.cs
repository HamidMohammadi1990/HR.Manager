using JavidHrm.Common.Models;
using Microsoft.AspNetCore.Http;
using JavidHrm.Application.Models.Dtos;

namespace JavidHrm.Application.Contracts.Infrastructure;

public interface IImageService
{
    Task<OperationResult<ImageInspectorResultDto>> GetImageMetaDataAsync(IFormFile file);
}