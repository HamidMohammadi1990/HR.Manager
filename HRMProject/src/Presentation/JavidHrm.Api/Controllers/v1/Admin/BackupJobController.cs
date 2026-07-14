using MediatR;
using Asp.Versioning;
using JavidHrm.Domain.Enums;
using JavidHrm.Common.Models;
using JavidHrm.Api.Attributes;
using JavidHrm.Common.Enums;
using Microsoft.AspNetCore.Mvc;
using JavidHrm.WebFramework.Api;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Application.Features.BackupJobs.Queries;
using JavidHrm.Application.Features.BackupJobs.Commands;

namespace JavidHrm.Api.Controllers.v1.Admin;

/// <summary>
/// Management Backup Jobs For Admin
/// </summary>
[ApiVersion("1")]
[ControllerName("backup-job")]
[ApiControllerCategory(ApiControllerCategory.HrOperations)]
[ControllerInfo(PermissionType.ManageBackupJob, PermissionType.ManageBackupJobGroup)]
public class BackupJobController(ISender mediator) : BaseApiAdminController
{
    [ActionInfo(PermissionType.ListBackupJob)]
    [HttpPost("get-all")]
    public async Task<ApiResult<PagedResult<GetAllBackupJobResponse>>> GetAll(GetAllBackupJobRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.GetBackupJobById)]
    [HttpPost("get")]
    public async Task<ApiResult<GetBackupJobResponse?>> Get(GetBackupJobRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.CreateBackupJob)]
    [HttpPost("create")]
    public async Task<ApiResult<CreateBackupJobResponse>> Create(CreateBackupJobRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.RunBackupJob)]
    [HttpPost("create-backup")]
    public async Task<ApiResult<CreateBackupResponse>> CreateBackup(CreateBackupRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DownloadBackupJob)]
    [HttpPost("download")]
    public async Task<IActionResult> Download(DownloadBackupJobRequest request)
    {
        var result = await mediator.Send(request);
        if (!result.IsSuccess || result.Result is null)
            return BadRequest(result);

        return File(result.Result.FileBytes, result.Result.ContentType, result.Result.FileName);
    }

    [ActionInfo(PermissionType.UpdateBackupJob)]
    [HttpPut("update")]
    public async Task<ApiResult<OperationResult>> Update(UpdateBackupJobRequest request)
        => await mediator.Send(request);

    [ActionInfo(PermissionType.DeleteBackupJob)]
    [HttpDelete("delete")]
    public async Task<ApiResult<OperationResult>> Delete(DeleteBackupJobRequest request)
        => await mediator.Send(request);
}
