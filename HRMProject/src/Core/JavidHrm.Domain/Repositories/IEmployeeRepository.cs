using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.Employees;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Domain.Repositories;

public interface IEmployeeRepository
{
    void Add(Employee employee);
    void Remove(Employee employee);
    ValueTask<Employee?> FindAsync(int id, CancellationToken cancellationToken = default);
    Task<Employee?> GetAsNoTrackingAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AnyAsync(Expression<Func<Employee, bool>> expression, CancellationToken cancellationToken = default);
    Task<PagedResult<GetAllEmployeeResponseDto>> GetAllAsync(
        GetAllEmployeeRequestDto request,
        Expression<Func<Employee, bool>>? contentFilter = null);
}
