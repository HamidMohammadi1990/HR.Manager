using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class UpdateWorkShiftHandler
    (IWorkShiftRepository workShiftRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateWorkShiftRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateWorkShiftRequest request, CancellationToken cancellationToken)
    {
        var workShift = await workShiftRepository.FindAsync(request.Id, cancellationToken);
        if (workShift is null)
            return ErrorModel.Create("InvalidId");

        workShift.Update(
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

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
