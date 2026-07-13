using JavidHrm.Domain.Enums;

namespace JavidHrm.Application.Models.Services;

public record UserSessionContext(
    string? IpAddress,
    string? UserAgent,
    string? DeviceName,
    DeviceType DeviceType,
    OperatingSystemType OperatingSystem);
