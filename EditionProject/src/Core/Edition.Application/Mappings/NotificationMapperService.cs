using JavidHrm.Application.Features.Notifications.Queries;
using JavidHrm.Domain.Dtos.Notifications;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Mappings;

public class NotificationMapperService : INotificationMapperService
{
    public GetAllNotificationRequestDto Map(GetAllNotificationRequest model)
        => new()
        {
            UserId = model.UserId,
            IsRead = model.IsRead,
            Type = model.Type,
            Title = model.Title,
            CreatedFromUtc = model.CreatedFromUtc,
            CreatedToUtc = model.CreatedToUtc,
            Pagination = model.Pagination
        };

    public GetNotificationResponse Map(Notification model, User user)
        => new()
        {
            Id = model.Id,
            UserId = model.UserId,
            UserFirstName = user.FirstName,
            UserLastName = user.LastName,
            UserName = user.UserName,
            Title = model.Title,
            Message = model.Message,
            Type = model.Type,
            IsRead = model.IsRead,
            ReadAtUtc = model.ReadAtUtc,
            LinkPath = model.LinkPath,
            IconName = model.IconName,
            CreatedOnUtc = model.CreatedOnUtc
        };

    public PagedResult<GetAllNotificationResponse> Map(PagedResult<GetAllNotificationResponseDto> model)
    {
        var items = model.Items.Select(x => new GetAllNotificationResponse
        {
            Id = x.Id,
            UserId = x.UserId,
            UserFirstName = x.UserFirstName,
            UserLastName = x.UserLastName,
            UserName = x.UserName,
            Title = x.Title,
            Message = x.Message,
            Type = x.Type,
            IsRead = x.IsRead,
            ReadAtUtc = x.ReadAtUtc,
            LinkPath = x.LinkPath,
            IconName = x.IconName,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return PagedResult<GetAllNotificationResponse>.Create(items, model);
    }
}
