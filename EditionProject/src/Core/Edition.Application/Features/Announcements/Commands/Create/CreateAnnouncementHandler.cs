using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class CreateAnnouncementHandler
    (IUnitOfWork uow, IAnnouncementRepository announcementRepository, ICurrentUserContext currentUser)
    : IRequestHandler<CreateAnnouncementRequest, OperationResult<CreateAnnouncementResponse>>
{
    public async Task<OperationResult<CreateAnnouncementResponse>> Handle(CreateAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = Domain.Entities.Announcement.Create(
            request.Title.Trim(),
            request.Content.Trim(),
            request.Status,
            request.Audience,
            request.Channel,
            request.DepartmentId,
            request.RoleId,
            request.ScheduledAtUtc,
            currentUser.UserId);

        announcementRepository.Add(announcement);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        if (!saveChangesResult.IsSuccess)
            return saveChangesResult.ToGenericFailure<CreateAnnouncementResponse>();

        return new CreateAnnouncementResponse { Id = announcement.Id };
    }
}
