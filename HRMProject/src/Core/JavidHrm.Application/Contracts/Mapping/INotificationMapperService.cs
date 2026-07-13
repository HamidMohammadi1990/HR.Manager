using JavidHrm.Application.Features.Notifications.Queries;
using JavidHrm.Domain.Dtos.Notifications;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Contracts.Mapping;

public interface INotificationMapperService : IMapper
{
    GetAllNotificationRequestDto Map(GetAllNotificationRequest model);
    GetNotificationResponse Map(Notification model, User user);
    PagedResult<GetAllNotificationResponse> Map(PagedResult<GetAllNotificationResponseDto> model);
}
