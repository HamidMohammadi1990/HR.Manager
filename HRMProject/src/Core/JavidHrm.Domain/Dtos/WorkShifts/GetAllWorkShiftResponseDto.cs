namespace JavidHrm.Domain.Dtos.WorkShifts;

public class GetAllWorkShiftResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public int BreakMinutes { get; set; }
    public int GraceMinutes { get; set; }
    public int EarlyLeaveGraceMinutes { get; set; }
    public bool IsOvernight { get; set; }
    public bool IsActive { get; set; }
    public string? Description { get; set; }
    public string? Color { get; set; }
}
