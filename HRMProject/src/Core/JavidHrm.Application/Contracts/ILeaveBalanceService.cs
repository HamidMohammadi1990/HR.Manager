using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Contracts;

public interface ILeaveBalanceService
{
    decimal CalculateDuration(LeaveTypeDefinition leaveTypeDefinition, DateTime startDate, DateTime endDate);

    Task<LeaveBalance?> EnsureAnnualBalanceAsync(
        int employeeId,
        LeaveTypeDefinition leaveTypeDefinition,
        int year,
        CancellationToken cancellationToken = default);

    Task<OperationResult> DeductForApprovedLeaveAsync(
        LeaveRequest leaveRequest,
        LeaveTypeDefinition leaveTypeDefinition,
        CancellationToken cancellationToken = default);
}
