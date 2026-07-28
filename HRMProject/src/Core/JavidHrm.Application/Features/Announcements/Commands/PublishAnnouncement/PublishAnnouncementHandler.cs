using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class PublishAnnouncementHandler
    (IAnnouncementRepository announcementRepository,
     IAnnouncementDispatchService announcementDispatchService,
     IUnitOfWork uow)
    : IRequestHandler<PublishAnnouncementRequest, OperationResult>
{
    public async Task<OperationResult> Handle(PublishAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = await announcementRepository.FindAsync(request.Id, cancellationToken);
        if (announcement is null)
            return ErrorModel.Create("InvalidId");

        if (announcement.Status == AnnouncementStatus.Sent)
            return ErrorModel.Create(MessageKeys.AnnouncementAlreadyPublished);

        announcement.Publish();

        var dispatchResult = await announcementDispatchService.DispatchInAppNotificationsAsync(
            announcement,
            cancellationToken);
        if (!dispatchResult.IsSuccess)
            return dispatchResult;

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
