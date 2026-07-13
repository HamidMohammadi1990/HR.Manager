using JavidHrm.Domain.Entities;
using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Departments;
using JavidHrm.Domain.Dtos.Pagination;

namespace JavidHrm.Domain.Repositories;

public interface IDepartmentRepository
{
    void Add(Department department);
    void Remove(Department department);
    ValueTask<Department?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Department?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Department, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllDepartmentResponseDto>> GetAllAsync(GetAllDepartmentRequestDto request, Expression<Func<Department, bool>>? contentFilter = null);
    Task<PagedResult<SearchDepartmentResponseDto>> SearchAsync(SearchDepartmentRequestDto request, Expression<Func<Department, bool>>? contentFilter = null);
}
