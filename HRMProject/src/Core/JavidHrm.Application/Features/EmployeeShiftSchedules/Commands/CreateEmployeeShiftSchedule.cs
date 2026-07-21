using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.EmployeeShiftSchedules.Commands;

public record CreateEmployeeShiftScheduleRequest : IRequest<OperationResult<CreateEmployeeShiftScheduleResponse>>
{
    [JsonConverter(typeof(EmployeeEncryptor))]
    public int EmployeeId { get; init; }

    [JsonConverter(typeof(WorkShiftEncryptor))]
    public int WorkShiftId { get; init; }

    public DateTime EffectiveFrom { get; init; }
    public DateTime? EffectiveTo { get; init; }
    public string? Note { get; init; }
}

public record CreateEmployeeShiftScheduleResponse
{
    public int Id { get; init; }
}

public class CreateEmployeeShiftScheduleValidator : AbstractValidator<CreateEmployeeShiftScheduleRequest>
{
    public CreateEmployeeShiftScheduleValidator(IEmployeeRepository employeeRepository, IWorkShiftRepository workShiftRepository)
    {
        RuleFor(x => x.EmployeeId).MustBeValidEntityId();
        RuleFor(x => x.WorkShiftId).MustBeValidEntityId();
        RuleFor(x => x.EffectiveFrom).NotEmpty();
        RuleFor(x => x)
            .Must(x => x.EffectiveTo is null || x.EffectiveTo.Value.Date >= x.EffectiveFrom.Date)
            .WithMessage(MessageKeys.StartDateMustBeBeforeEndDate);
        RuleFor(x => x.EmployeeId)
            .MustAsync((id, ct) => employeeRepository.AnyAsync(e => e.Id == id, ct))
            .WithMessage(MessageKeys.InvalidId);
        RuleFor(x => x.WorkShiftId)
            .MustAsync((id, ct) => workShiftRepository.AnyAsync(s => s.Id == id && s.IsActive, ct))
            .WithMessage(MessageKeys.InvalidId);
    }
}

public class CreateEmployeeShiftScheduleHandler
    (IEmployeeShiftScheduleRepository scheduleRepository, IUnitOfWork uow)
    : IRequestHandler<CreateEmployeeShiftScheduleRequest, OperationResult<CreateEmployeeShiftScheduleResponse>>
{
    public async Task<OperationResult<CreateEmployeeShiftScheduleResponse>> Handle(
        CreateEmployeeShiftScheduleRequest request,
        CancellationToken cancellationToken)
    {
        if (await scheduleRepository.HasOverlappingAsync(
                request.EmployeeId,
                request.EffectiveFrom,
                request.EffectiveTo,
                cancellationToken: cancellationToken))
            return ErrorModel.Create(MessageKeys.OverlappingShiftSchedule);

        var schedule = Domain.Entities.EmployeeShiftSchedule.Create(
            request.EmployeeId,
            request.WorkShiftId,
            request.EffectiveFrom,
            request.EffectiveTo,
            request.Note);

        scheduleRepository.Add(schedule);
        var result = await uow.SaveChangesAsync(cancellationToken);
        return result.IsSuccess
            ? new CreateEmployeeShiftScheduleResponse { Id = schedule.Id }
            : result.ToGenericFailure<CreateEmployeeShiftScheduleResponse>();
    }
}
