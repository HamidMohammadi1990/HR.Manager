using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class CreateWorkShiftHandler
    (IUnitOfWork uow, IWorkShiftRepository workShiftRepository)
    : IRequestHandler<CreateWorkShiftRequest, OperationResult<CreateWorkShiftResponse>>
{
    public async Task<OperationResult<CreateWorkShiftResponse>> Handle(CreateWorkShiftRequest request, CancellationToken cancellationToken)
    {
        var workShift = Domain.Entities.WorkShift.Create(
            request.Name.Trim(),
            request.StartTime,
            request.EndTime,
            request.BreakMinutes,
            request.GraceMinutes,
            request.EarlyLeaveGraceMinutes,
            request.IsOvernight,
            request.IsActive,
            request.Description?.Trim(),
            request.Color?.Trim());

        workShiftRepository.Add(workShift);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateWorkShiftResponse>();

        return new CreateWorkShiftResponse { Id = workShift.Id };
    }
}
