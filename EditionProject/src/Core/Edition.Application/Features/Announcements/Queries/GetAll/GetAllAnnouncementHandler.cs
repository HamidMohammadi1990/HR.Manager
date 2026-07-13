using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.Announcements.Queries;

public class GetAllAnnouncementHandler
    (IAnnouncementRepository announcementRepository, IAnnouncementMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllAnnouncementRequest, OperationResult<PagedResult<GetAllAnnouncementResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllAnnouncementResponse>>> Handle(GetAllAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.Announcement>();
        var announcements = await announcementRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(announcements);
    }
}
