namespace JavidHrm.Application.Features.PayrollEntries.Queries;

public record GetPayrollPayslipPdfResponse
{
    public byte[] PdfBytes { get; init; } = default!;
    public string FileName { get; init; } = default!;
    public string ContentType { get; init; } = "text/html; charset=utf-8";
}
