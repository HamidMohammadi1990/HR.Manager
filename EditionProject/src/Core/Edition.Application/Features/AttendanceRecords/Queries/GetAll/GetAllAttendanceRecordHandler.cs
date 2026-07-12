using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.AttendanceRecords.Queries;

public class GetAllAttendanceRecordHandler
    (IAttendanceRecordRepository attendanceRecordRepository, IAttendanceRecordMapperService mapper, IContentPolicyFilterContext contentPolicyFilterContext)
    : IRequestHandler<GetAllAttendanceRecordRequest, OperationResult<PagedResult<GetAllAttendanceRecordResponse>>>
{
    public async Task<OperationResult<PagedResult<GetAllAttendanceRecordResponse>>> Handle(GetAllAttendanceRecordRequest request, CancellationToken cancellationToken)
    {
        var requestModel = mapper.Map(request);
        var filter = contentPolicyFilterContext.GetContentFilter<Domain.Entities.AttendanceRecord>();
        var attendanceRecords = await attendanceRecordRepository.GetAllAsync(requestModel, filter);
        return mapper.Map(attendanceRecords);
    }
}
