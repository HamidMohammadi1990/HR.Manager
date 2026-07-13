using JavidHrm.Domain.Common;

namespace JavidHrm.Domain.Entities;

public class Bank : BaseEntity
{
    public string Title { get; set; } = default!;
    public string Icon { get; set; } = default!;
    public bool IsActive { get; set; } = default!;
}