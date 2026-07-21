using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.LeaveTypeDefinitions;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface ILeaveTypeDefinitionRepository
{
    void Add(LeaveTypeDefinition leaveTypeDefinition);
    void Remove(LeaveTypeDefinition leaveTypeDefinition);
    ValueTask<LeaveTypeDefinition?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<LeaveTypeDefinition?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<LeaveTypeDefinition, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllLeaveTypeDefinitionResponseDto>> GetAllAsync(
        GetAllLeaveTypeDefinitionRequestDto request,
        Expression<Func<LeaveTypeDefinition, bool>>? contentFilter = null);
    Task<PagedResult<SearchLeaveTypeDefinitionResponseDto>> SearchAsync(
        SearchLeaveTypeDefinitionRequestDto request,
        Expression<Func<LeaveTypeDefinition, bool>>? contentFilter = null);
}
