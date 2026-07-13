using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Application.Features.CalendarEvents.Queries;

public class GetAllCalendarEventHandler
    (ICalendarEventRepository calendarEventRepository, ICalendarEventMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllCalendarEventRequest, OperationResult<PagedResult<GetAllCalendarEventResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllCalendarEventResponse>>> Handle(GetAllCalendarEventRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.CalendarEvent>();
        var calendarEvents = await calendarEventRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(calendarEvents);
    }
}
