using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.WorkShifts.Commands;

public class DeleteWorkShiftHandler
    (IWorkShiftRepository workShiftRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteWorkShiftRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteWorkShiftRequest request, CancellationToken cancellationToken)
    {
        var workShift = await workShiftRepository.FindAsync(request.Id, cancellationToken);
        if (workShift is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        if (await workShiftRepository.IsInUseAsync(request.Id, cancellationToken))
            return ErrorModel.Create(MessageKeys.WorkShiftInUse);

        workShiftRepository.Remove(workShift);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
