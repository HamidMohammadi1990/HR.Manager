using JavidHrm.Application.Services.Payroll;
using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetPayrollPayslipPdfHandler
    (IPayrollEntryRepository payrollEntryRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository)
    : IRequestHandler<GetPayrollPayslipPdfRequest, OperationResult<GetPayrollPayslipPdfResponse>>
{
    public async Task<OperationResult<GetPayrollPayslipPdfResponse>> Handle(GetPayrollPayslipPdfRequest request, CancellationToken cancellationToken)
    {
        var payrollEntry = await payrollEntryRepository.GetAsNoTrackingAsync(request.Id, cancellationToken);
        if (payrollEntry is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        var employee = await employeeRepository.GetAsNoTrackingAsync(payrollEntry.EmployeeId, cancellationToken);
        if (employee is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        var user = await userRepository.GetAsNoTrackingAsync(employee.UserId, cancellationToken);
        if (user is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        var department = await departmentRepository.GetAsNoTrackingAsync(employee.DepartmentId, cancellationToken);
        if (department is null)
            return ErrorModel.Create(MessageKeys.InvalidId);

        var employeeName = $"{user.FirstName} {user.LastName}".Trim();
        var fileName = $"payslip-{employee.EmployeeCode}-{payrollEntry.Year}-{payrollEntry.Month:D2}.html";
        var fileBytes = PayslipHtmlGenerator.Generate(payrollEntry, employeeName, employee.EmployeeCode, department.Name);

        return new GetPayrollPayslipPdfResponse
        {
            PdfBytes = fileBytes,
            FileName = fileName,
            ContentType = "text/html; charset=utf-8"
        };
    }
}
