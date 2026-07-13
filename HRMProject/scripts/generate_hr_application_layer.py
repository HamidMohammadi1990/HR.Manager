#!/usr/bin/env python3
"""Generate HR application layer files following Notifications/LeaveRequest patterns."""
from __future__ import annotations
from pathlib import Path

BASE = Path(r"C:\Users\40312758\Desktop\hr.manager.front.end-main\EditionProject")
created: list[str] = []


def w(rel: str, content: str) -> None:
    p = BASE / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content.strip() + "\n", encoding="utf-8")
    created.append(rel.replace("\\", "/"))


def repo_interface(entity: str, folder: str, extra: str = "") -> None:
    w(
        f"src/Core/Edition.Domain/Repositories/I{entity}Repository.cs",
        f"""
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.{folder};
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface I{entity}Repository
{{
    void Add({entity} entity);
    void Remove({entity} entity);
    ValueTask<{entity}?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<{entity}?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<{entity}, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAll{entity}ResponseDto>> GetAllAsync(
        GetAll{entity}RequestDto request,
        Expression<Func<{entity}, bool>>? contentFilter = null);
{extra}
}}
""",
    )


# --- Announcements ---
folder = "Announcements"
entity = "Announcement"
repo_interface(entity, folder)

w(
    f"src/Core/Edition.Domain/Dtos/{folder}/GetAll{entity}RequestDto.cs",
    """
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.QueryFilters;

namespace JavidHrm.Domain.Dtos.Announcements;

public record GetAllAnnouncementRequestDto
{
    [QueryFilter(MemberPath = "announcement.Status")]
    public AnnouncementStatus? Status { get; init; }

    [QueryFilter(MemberPath = "announcement.Audience")]
    public AnnouncementAudience? Audience { get; init; }

    [QueryFilter(MemberPath = "announcement.Channel")]
    public AnnouncementChannel? Channel { get; init; }

    [QueryFilter(MemberPath = "announcement.DepartmentId")]
    public int? DepartmentId { get; init; }

    [QueryFilter(MemberPath = "announcement.RoleId")]
    public int? RoleId { get; init; }

    [QueryFilter(MemberPath = "announcement.Title", Operator = FilterOperator.Contains)]
    public string? Title { get; init; }

    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }

    public PagedRequest Pagination { get; init; } = default!;
}
""",
)

w(
    f"src/Core/Edition.Domain/Dtos/{folder}/GetAll{entity}ResponseDto.cs",
    """
using JavidHrm.Domain.Enums;

namespace JavidHrm.Domain.Dtos.Announcements;

public class GetAllAnnouncementResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Content { get; set; } = default!;
    public AnnouncementStatus Status { get; set; }
    public AnnouncementAudience Audience { get; set; }
    public AnnouncementChannel Channel { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public int? RoleId { get; set; }
    public string? RoleName { get; set; }
    public DateTime? ScheduledAtUtc { get; set; }
    public DateTime? PublishedAtUtc { get; set; }
    public int CreatedByUserId { get; set; }
    public string? CreatorFirstName { get; set; }
    public string? CreatorLastName { get; set; }
    public string? CreatorUserName { get; set; }
    public DateTime CreatedOnUtc { get; set; }
}
""",
)

w(
    f"src/Infrastructure/Edition.Infrastructure.Persistence/Repositories/{entity}Repository.cs",
    """
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Announcements;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class AnnouncementRepository(JavidHrmDbContext context)
    : Repository<Announcement>(context), IAnnouncementRepository
{
    public async Task<PagedResult<GetAllAnnouncementResponseDto>> GetAllAsync(
        GetAllAnnouncementRequestDto request,
        Expression<Func<Announcement, bool>>? contentFilter = null)
    {
        var requestSource = Context.Announcement.ApplyContentPolicyFilter(contentFilter);

        var announcements =
            from announcement in requestSource
            join user in Context.User on announcement.CreatedByUserId equals user.Id
            join department in Context.Department on announcement.DepartmentId equals department.Id into departments
            from department in departments.DefaultIfEmpty()
            join role in Context.Role on announcement.RoleId equals role.Id into roles
            from role in roles.DefaultIfEmpty()
            select new { announcement, user, department, role };

        announcements = announcements.ApplyQueryFilters(request);

        if (request.CreatedFromUtc.HasValue)
            announcements = announcements.Where(x => x.announcement.CreatedOnUtc >= request.CreatedFromUtc.Value);

        if (request.CreatedToUtc.HasValue)
            announcements = announcements.Where(x => x.announcement.CreatedOnUtc <= request.CreatedToUtc.Value);

        return await announcements
            .OrderByDescending(x => x.announcement.CreatedOnUtc)
            .Select(x => new GetAllAnnouncementResponseDto
            {
                Id = x.announcement.Id,
                Title = x.announcement.Title,
                Content = x.announcement.Content,
                Status = x.announcement.Status,
                Audience = x.announcement.Audience,
                Channel = x.announcement.Channel,
                DepartmentId = x.announcement.DepartmentId,
                DepartmentName = x.department != null ? x.department.Name : null,
                RoleId = x.announcement.RoleId,
                RoleName = x.role != null ? x.role.Name : null,
                ScheduledAtUtc = x.announcement.ScheduledAtUtc,
                PublishedAtUtc = x.announcement.PublishedAtUtc,
                CreatedByUserId = x.announcement.CreatedByUserId,
                CreatorFirstName = x.user.FirstName,
                CreatorLastName = x.user.LastName,
                CreatorUserName = x.user.UserName,
                CreatedOnUtc = x.announcement.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }
}
""",
)

# Mapper interface + service for Announcement
w(
    "src/Core/Edition.Application/Contracts/Mapping/IAnnouncementMapperService.cs",
    """
using JavidHrm.Application.Features.Announcements.Queries;
using JavidHrm.Domain.Dtos.Announcements;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts.Mapping;

public interface IAnnouncementMapperService : IMapper
{
    GetAllAnnouncementRequestDto Map(GetAllAnnouncementRequest model);
    GetAnnouncementResponse Map(Announcement model, User creator, Department? department, Role? role);
    PagedResult<GetAllAnnouncementResponse> Map(PagedResult<GetAllAnnouncementResponseDto> model);
}
""",
)

w(
    "src/Core/Edition.Application/Mappings/AnnouncementMapperService.cs",
    """
using JavidHrm.Application.Features.Announcements.Queries;
using JavidHrm.Domain.Dtos.Announcements;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class AnnouncementMapperService : IAnnouncementMapperService
{
    public GetAllAnnouncementRequestDto Map(GetAllAnnouncementRequest model)
        => new()
        {
            Status = model.Status,
            Audience = model.Audience,
            Channel = model.Channel,
            DepartmentId = model.DepartmentId,
            RoleId = model.RoleId,
            Title = model.Title,
            CreatedFromUtc = model.CreatedFromUtc,
            CreatedToUtc = model.CreatedToUtc,
            Pagination = model.Pagination
        };

    public GetAnnouncementResponse Map(Announcement model, User creator, Department? department, Role? role)
        => new()
        {
            Id = model.Id,
            Title = model.Title,
            Content = model.Content,
            Status = model.Status,
            Audience = model.Audience,
            Channel = model.Channel,
            DepartmentId = model.DepartmentId,
            DepartmentName = department?.Name,
            RoleId = model.RoleId,
            RoleName = role?.Name,
            ScheduledAtUtc = model.ScheduledAtUtc,
            PublishedAtUtc = model.PublishedAtUtc,
            CreatedByUserId = model.CreatedByUserId,
            CreatorFirstName = creator.FirstName,
            CreatorLastName = creator.LastName,
            CreatorUserName = creator.UserName,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllAnnouncementResponse> Map(PagedResult<GetAllAnnouncementResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllAnnouncementResponse
        {
            Id = x.Id,
            Title = x.Title,
            Content = x.Content,
            Status = x.Status,
            Audience = x.Audience,
            Channel = x.Channel,
            DepartmentId = x.DepartmentId,
            DepartmentName = x.DepartmentName,
            RoleId = x.RoleId,
            RoleName = x.RoleName,
            ScheduledAtUtc = x.ScheduledAtUtc,
            PublishedAtUtc = x.PublishedAtUtc,
            CreatedByUserId = x.CreatedByUserId,
            CreatorFirstName = x.CreatorFirstName,
            CreatorLastName = x.CreatorLastName,
            CreatorUserName = x.CreatorUserName,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllAnnouncementResponse>.Create(items, model);
    }
}
""",
)

print(f"Generated Announcement base files. Total so far: {len(created)}")
