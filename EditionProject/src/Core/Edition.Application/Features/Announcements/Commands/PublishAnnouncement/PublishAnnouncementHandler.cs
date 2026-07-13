using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class PublishAnnouncementHandler
    (IAnnouncementRepository announcementRepository, IUnitOfWork uow)
    : IRequestHandler<PublishAnnouncementRequest, OperationResult>
{
    public async Task<OperationResult> Handle(PublishAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = await announcementRepository.FindAsync(request.Id, cancellationToken);
        if (announcement is null)
            return ErrorModel.Create("InvalidId");

        announcement.Publish();

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
