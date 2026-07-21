using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.EmployeeShiftSchedules.Queries;

public record GetEmployeeShiftSchedulesRequest : IRequest<OperationResult<IReadOnlyList<EmployeeShiftScheduleResponse>>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }
}

public record EmployeeShiftScheduleResponse
{
    public int Id { get; init; }

    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int WorkShiftId { get; init; }

    public string WorkShiftName { get; init; } = default!;
    public TimeOnly WorkShiftStartTime { get; init; }
    public TimeOnly WorkShiftEndTime { get; init; }
    public bool WorkShiftIsOvernight { get; init; }
    public DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public string? Note { get; init; }
    public DateTime CreatedOnUtc { get; init; }
}

public class GetEmployeeShiftSchedulesHandler
    (IEmployeeShiftScheduleRepository scheduleRepository)
    : IRequestHandler<GetEmployeeShiftSchedulesRequest, OperationResult<IReadOnlyList<EmployeeShiftScheduleResponse>>>
{
    public async Task<OperationResult<IReadOnlyList<EmployeeShiftScheduleResponse>>> Handle(
        GetEmployeeShiftSchedulesRequest request,
        CancellationToken cancellationToken)
    {
        var schedules = await scheduleRepository.GetByEmployeeIdAsync(request.EmployeeId, cancellationToken);
        var items = schedules.Select(x => new EmployeeShiftScheduleResponse
        {
            Id = x.Id,
            EmployeeId = x.EmployeeId,
            WorkShiftId = x.WorkShiftId,
            WorkShiftName = x.WorkShift.Name,
            WorkShiftStartTime = x.WorkShift.StartTime,
            WorkShiftEndTime = x.WorkShift.EndTime,
            WorkShiftIsOvernight = x.WorkShift.IsOvernight,
            EffectiveFrom = x.EffectiveFrom,
            EffectiveTo = x.EffectiveTo,
            Note = x.Note,
            CreatedOnUtc = x.CreatedOnUtc
        }).ToList();

        return items;
    }
}
