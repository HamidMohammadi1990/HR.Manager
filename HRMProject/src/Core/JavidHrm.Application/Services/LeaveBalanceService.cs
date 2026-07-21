using JavidHrm.Application.Contracts;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Entities;
using JavidHrm.Domain.Enums;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Services;

public class LeaveBalanceService(ILeaveBalanceRepository leaveBalanceRepository) : ILeaveBalanceService
{
    public decimal CalculateDuration(LeaveTypeDefinition leaveTypeDefinition, DateTime startDate, DateTime endDate)
    {
        if (leaveTypeDefinition.Unit == LeaveTypeUnit.Hour)
        {
            var hours = (decimal)(endDate - startDate).TotalHours;
            return Math.Round(Math.Max(0, hours), 2);
        }

        var start = startDate.Date;
        var end = endDate.Date;
        if (end < start)
            return 0;

        if (leaveTypeDefinition.IncludeWeekends)
            return (end - start).Days + 1;

        var days = 0;
        for (var date = start; date <= end; date = date.AddDays(1))
        {
            if (date.DayOfWeek is DayOfWeek.Friday or DayOfWeek.Saturday)
                continue;
            days++;
        }

        return days;
    }

    public async Task<LeaveBalance?> EnsureAnnualBalanceAsync(
        int employeeId,
        LeaveTypeDefinition leaveTypeDefinition,
        int year,
        CancellationToken cancellationToken = default)
    {
        if (!leaveTypeDefinition.AffectsLeaveBalance)
            return null;

        var existing = await leaveBalanceRepository.FindByEmployeeAndTypeAndYearAsync(
            employeeId,
            leaveTypeDefinition.Id,
            year,
            cancellationToken);

        if (existing is not null)
            return existing;

        var totalDays = leaveTypeDefinition.DefaultAnnualAllowance ?? 0;
        var balance = LeaveBalance.Create(employeeId, leaveTypeDefinition.Id, year, totalDays, 0);
        leaveBalanceRepository.Add(balance);
        return balance;
    }

    public async Task<OperationResult> DeductForApprovedLeaveAsync(
        LeaveRequest leaveRequest,
        LeaveTypeDefinition leaveTypeDefinition,
        CancellationToken cancellationToken = default)
    {
        if (!leaveTypeDefinition.AffectsLeaveBalance)
            return OperationResult.Success();

        var year = leaveRequest.StartDate.Year;
        var balance = await EnsureAnnualBalanceAsync(
            leaveRequest.EmployeeId,
            leaveTypeDefinition,
            year,
            cancellationToken);

        if (balance is null)
            return OperationResult.Success();

        var duration = CalculateDuration(leaveTypeDefinition, leaveRequest.StartDate, leaveRequest.EndDate);

        if (leaveTypeDefinition.MaxPerRequest.HasValue && duration > leaveTypeDefinition.MaxPerRequest.Value)
            return ErrorModel.Create(MessageKeys.InvalidRequest);

        var remaining = balance.RemainingDays;
        if (duration > remaining && !leaveTypeDefinition.AllowNegativeBalance)
            return ErrorModel.Create(MessageKeys.InsufficientLeaveBalance);

        balance.UseDays(duration);
        return OperationResult.Success();
    }
}
