using JavidHrm.Common.Models;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Application.Contracts.ContentPolicies;

namespace JavidHrm.Application.Features.Banks.Queries;

public record SearchBankRequest : IRequest<OperationResult<PagedResult<SearchBankResponse>>>, IContentPolicyFilteredRequest<Bank>
{
    public string? Title { get; init; }
    public PagedRequest Pagination { get; init; } = default!;
}
