using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.WorkShifts.Queries;

public class GetWorkShiftHandler
    (IWorkShiftRepository workShiftRepository, IWorkShiftMapperService mapper)
    : IRequestHandler<GetWorkShiftRequest, OperationResult<GetWorkShiftResponse?>>
{
    public async Task<OperationResult<GetWorkShiftResponse?>> Handle(GetWorkShiftRequest request, CancellationToken cancellationToken)
    {
        var workShift = await workShiftRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (workShift is null)
            return (GetWorkShiftResponse?)null;

        return mapper.Map(workShift);
    }
}
