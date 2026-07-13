using System.Linq.Expressions;
using JavidHrm.Domain.Dtos.AttendanceRecords;
using JavidHrm.Domain.Dtos.Pagination;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Repositories;
using JavidHrm.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;

namespace JavidHrm.Infrastructure.Persistence.Repositories;

public class AttendanceRecordRepository(JavidHrmDbContext context)
    : Repository<AttendanceRecord>(context), IAttendanceRecordRepository
{
    public async Task<PagedResult<GetAllAttendanceRecordResponseDto>> GetAllAsync(
        GetAllAttendanceRecordRequestDto request,
        Expression<Func<AttendanceRecord, bool>>? contentFilter = null)
    {
        var recordSource = Context.AttendanceRecord.ApplyContentPolicyFilter(contentFilter);

        var records =
            from record in recordSource
            join employee in Context.Employee on record.EmployeeId equals employee.Id
            join user in Context.User on employee.UserId equals user.Id
            join department in Context.Department on employee.DepartmentId equals department.Id
            select new { record, employee, user, department };

        records = records.ApplyQueryFilters(request);

        return await records
            .Select(x => new GetAllAttendanceRecordResponseDto
            {
                Id = x.record.Id,
                EmployeeId = x.record.EmployeeId,
                UserFirstName = x.user.FirstName,
                UserLastName = x.user.LastName,
                UserName = x.user.UserName,
                DepartmentId = x.employee.DepartmentId,
                DepartmentName = x.department.Name,
                EmployeeCode = x.employee.EmployeeCode,
                WorkDate = x.record.WorkDate,
                CheckInUtc = x.record.CheckInUtc,
                CheckOutUtc = x.record.CheckOutUtc,
                Status = x.record.Status,
                CreatedOnUtc = x.record.CreatedOnUtc
            })
            .AsNoTracking()
            .ToPagedAsync(request.Pagination);
    }

    public Task<AttendanceRecord?> FindByEmployeeAndWorkDateAsync(
        int employeeId,
        DateTime workDate,
        CancellationToken cancellationToken = default)
        => Context.AttendanceRecord
            .FirstOrDefaultAsync(
                record => record.EmployeeId == employeeId && record.WorkDate == workDate.Date,
                cancellationToken);
}
