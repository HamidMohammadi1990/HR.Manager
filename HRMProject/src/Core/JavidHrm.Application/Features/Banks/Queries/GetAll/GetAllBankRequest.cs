using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Banks.Queries;

public record GetAllBankRequest : IRequest<OperationResult<PagedResult<GetAllBankResponse>>>, IContentPolicyFilteredRequest<Bank>
{
    public string? Title { get; init; }
    public bool? IsActive { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
