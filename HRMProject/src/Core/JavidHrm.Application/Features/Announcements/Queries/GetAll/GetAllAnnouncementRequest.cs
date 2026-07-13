using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.ContentPolicies;
using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Features.Announcements.Queries;

public record GetAllAnnouncementRequest : IRequest<OperationResult<PagedResult<GetAllAnnouncementResponse>>>, IContentPolicyFilteredRequest<Announcement>
{
    public AnnouncementStatus? Status { get; init; }
    public AnnouncementAudience? Audience { get; init; }
    public AnnouncementChannel? Channel { get; init; }

    [JsonConverter(typeof(DepartmentNullableEncryptor))]
    public int? DepartmentId { get; init; }

    [JsonConverter(typeof(RoleNullableEncryptor))]
    public int? RoleId { get; init; }

    public string? Title { get; init; }
    public DateTime? CreatedFromUtc { get; init; }
    public DateTime? CreatedToUtc { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
