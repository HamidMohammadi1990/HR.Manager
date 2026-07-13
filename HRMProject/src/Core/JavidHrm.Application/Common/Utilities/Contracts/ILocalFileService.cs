using JavidHrm.Common.Models;
using Microsoft.AspNetCore.Http;

namespace JavidHrm.Application.Common.Utilities.Contracts;

public interface ILocalFileService
{
    OperationResult DeleteFile(string filePath);
    OperationResult DeleteDirectory(string directoryPath);
    OperationResult DeleteFile(string path, string fileName);
    Task<OperationResult> SaveFile(IFormFile file, string directoryPath);
    Task<OperationResult<string>> SaveFileAsync(IFormFile file, string directoryPath);
    Task<OperationResult> SaveFileAsync(IFormFile file, string directoryPath, string fileName);
}