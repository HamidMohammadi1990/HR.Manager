using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class DeleteAnnouncementHandler
    (IAnnouncementRepository announcementRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteAnnouncementRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = await announcementRepository.FindAsync(request.Id, cancellationToken);
        if (announcement is null)
            return ErrorModel.Create("InvalidId");

        announcementRepository.Remove(announcement);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
