using JavidHrm.Domain.Entities;
using JavidHrm.Common.Extensions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Dtos.Permissions;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Features.Permissions.Queries;

namespace JavidHrm.Application.Mappings;

public class PermissionMapperService : IPermissionMapperService
{
    public PagedResult<GetAllPermissionResponse> Map(PagedResult<Permission> model)
    {
        var items = model
            .Items
            .Select(x => new GetAllPermissionResponse
            {
                Id = x.Id,
                Url = x.Url,
                Title = x.Title,
                IsActive = x.IsActive,
                ParentId = x.ParentId,
                Priority = x.Priority,
                NameSpace = x.NameSpace,
                LevelTypeId = x.LevelTypeId,
                LevelTypeTitle = x.LevelTypeId.ToDisplay()
            })
            .ToList();

        return PagedResult<GetAllPermissionResponse>.Create(items, model);
    }

    public GetPermissionResponse Map(Permission model)
    {
        return new GetPermissionResponse
        {
            Id = model.Id,
            Url = model.Url,
            Title = model.Title,
            IsActive = model.IsActive,
            ParentId = model.ParentId,
            Priority = model.Priority,
            NameSpace = model.NameSpace,
            LevelTypeId = model.LevelTypeId
        };
    }

    public HasPermissionResponse Map(bool hasPermission)
    {
        return new HasPermissionResponse { HasPermission = hasPermission };
    }

    public GetAllPermissionRequestDto Map(GetAllPermissionRequest model)
    {
        return new GetAllPermissionRequestDto
        {
            Url = model.Url,
            Title = model.Title,
            IsActive = model.IsActive,
            ParentId = model.ParentId,
            NameSpace = model.NameSpace,
            LevelTypeId = model.LevelTypeId,
            Pagination = model.Pagination
        };
    }
}