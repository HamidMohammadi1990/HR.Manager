using FluentValidation;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using System.Text.Json.Serialization;
using JavidHrm.Application.Common.Utilities.Security.Attributes;
using JavidHrm.Application.Contracts.Persistence;
using JavidHrm.Application.Common.Validation;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.EmployeeShiftSchedules.Commands;

public record DeleteEmployeeShiftScheduleRequest : IRequest<OperationResult>
{
    public int Id { get; init; }
}

public class DeleteEmployeeShiftScheduleValidator : AbstractValidator<DeleteEmployeeShiftScheduleRequest>
{
    public DeleteEmployeeShiftScheduleValidator() => RuleFor(x => x.Id).GreaterThan(0);
}

public class DeleteEmployeeShiftScheduleHandler
    (IEmployeeShiftScheduleRepository scheduleRepository, IUnitOfWork uow)
    : IRequestHandler<DeleteEmployeeShiftScheduleRequest, OperationResult>
{
    public async Task<OperationResult> Handle(DeleteEmployeeShiftScheduleRequest request, CancellationToken cancellationToken)
    {
        var schedule = await scheduleRepository.FindAsync(request.Id, cancellationToken);
        if (schedule is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        scheduleRepository.Remove(schedule);
        var result = await uow.SaveChangesAsync(cancellationToken);
        return result.IsSuccess ? OperationResult.Success() : result;
    }
}
