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
