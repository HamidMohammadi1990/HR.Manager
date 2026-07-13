using JavidHrm.Common.Localization;
using JavidHrm.Common.Models;
using JavidHrm.Domain.Repositories;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public class GetPayrollPayslipPdfHandler
    (IPayrollEntryRepository payrollEntryRepository, IEmployeeRepository employeeRepository, IUserRepository userRepository, IDepartmentRepository departmentRepository)
    : IRequestHandler<GetPayrollPayslipPdfRequest, OperationResult<GetPayrollPayslipPdfResponse>>
{
    static GetPayrollPayslipPdfHandler()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

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
        var fileName = $"payslip-{employee.EmployeeCode}-{payrollEntry.Year}-{payrollEntry.Month:D2}.pdf";

        var pdfBytes = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header().Column(column =>
                {
                    column.Item().AlignCenter().Text("فیش حقوقی").FontSize(20).SemiBold();
                    column.Item().AlignCenter().Text($"دوره: {payrollEntry.Year}/{payrollEntry.Month:D2}").FontSize(14);
                });

                page.Content().PaddingVertical(20).Column(column =>
                {
                    column.Spacing(8);
                    column.Item().Text($"نام کارمند: {employeeName}");
                    column.Item().Text($"کد پرسنلی: {employee.EmployeeCode}");
                    column.Item().Text($"دپارتمان: {department.Name}");
                    column.Item().PaddingTop(10).LineHorizontal(1);
                    column.Item().Text($"حقوق پایه: {payrollEntry.BaseSalary:N0} ریال");
                    column.Item().Text($"ناخالص: {payrollEntry.GrossAmount:N0} ریال");
                    column.Item().Text($"کسورات: {payrollEntry.Deductions:N0} ریال");
                    column.Item().Text($"خالص پرداختی: {payrollEntry.NetAmount:N0} ریال").SemiBold();
                    if (!string.IsNullOrWhiteSpace(payrollEntry.Notes))
                        column.Item().PaddingTop(10).Text($"یادداشت: {payrollEntry.Notes}");
                });

                page.Footer().AlignCenter().Text(text =>
                {
                    text.Span("تاریخ صدور: ");
                    text.Span(DateTime.UtcNow.ToString("yyyy/MM/dd HH:mm"));
                });
            });
        }).GeneratePdf();

        return new GetPayrollPayslipPdfResponse
        {
            PdfBytes = pdfBytes,
            FileName = fileName
        };
    }
}
