using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using JavidHrm.Application.Contracts.Mapping;

namespace JavidHrm.Application.Features.Announcements.Queries;

public class GetAnnouncementHandler
    (IAnnouncementRepository announcementRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository, IRoleRepository roleRepository, IAnnouncementMapperService mapper)
    : IRequestHandler<GetAnnouncementRequest, OperationResult<GetAnnouncementResponse?>>
{
    public async Task<OperationResult<GetAnnouncementResponse?>> Handle(GetAnnouncementRequest request, CancellationToken cancellationToken)
    {
        var announcement = await announcementRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (announcement is null)
            return (GetAnnouncementResponse?)null;

        var creator = await userRepository.GetAsNoTrackingAsync(announcement.CreatedByUserId, cancellationToken);
        if (creator is null)
            return ErrorModel.Create("InvalidId");

        Domain.Entities.Department? department = null;
        if (announcement.DepartmentId.HasValue)
        {
            department = await departmentRepository.GetAsNoTrackingAsync(announcement.DepartmentId.Value, cancellationToken);
            if (department is null)
                return ErrorModel.Create("InvalidId");
        }

        Domain.Entities.Role? role = null;
        if (announcement.RoleId.HasValue)
        {
            role = await roleRepository.GetAsNoTrackingAsync(announcement.RoleId.Value, cancellationToken);
            if (role is null)
                return ErrorModel.Create("InvalidId");
        }

        return mapper.Map(announcement, creator, department, role);
    }
}
