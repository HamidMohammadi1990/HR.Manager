using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Persistence;

namespace JavidHrm.Application.Features.Announcements.Commands;

public class UpdateAnnouncementHandler
    (IAnnouncementRepository announcementRepository, IUnitOfWork uow)
    : IRequestHandler<UpdateAnnouncementRequest, OperationResult>
{
    public async Task<OperationResult> Handle(UpdateAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = await announcementRepository.FindAsync(request.Id, cancellationToken);
        if (announcement is null)
            return ErrorModel.Create("InvalidId");

        announcement.Update(
            request.Title.Trim(),
            request.Content.Trim(),
            request.Status,
            request.Audience,
            request.Channel,
            request.DepartmentId,
            request.RoleId,
            request.ScheduledAtUtc);

        var saveChangesResult = await uow.SaveChangesAsync(cancellationToken);
        return saveChangesResult.IsSuccess ? OperationResult.Success() : saveChangesResult;
    }
}
