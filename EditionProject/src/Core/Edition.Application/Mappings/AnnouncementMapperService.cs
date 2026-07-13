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
