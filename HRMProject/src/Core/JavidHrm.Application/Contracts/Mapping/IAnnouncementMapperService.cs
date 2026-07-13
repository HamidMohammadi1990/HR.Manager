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
