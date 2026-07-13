using System.Globalization;
using System.Net;
using System.Text;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Services.Payroll;

public static class PayslipHtmlGenerator
{
    private static readonly CultureInfo FaCulture = CultureInfo.GetCultureInfo("fa-IR");

    private const string Styles = """
        <style>
          body { font-family: Tahoma, 'Segoe UI', sans-serif; margin: 40px; color: #111; line-height: 1.7; }
          h1 { text-align: center; margin-bottom: 4px; }
          .subtitle { text-align: center; color: #555; margin-bottom: 28px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #ccc; padding: 10px 12px; text-align: right; }
          th { background: #f5f5f5; width: 35%; }
          .net { font-weight: bold; font-size: 1.1em; }
          .footer { margin-top: 32px; text-align: center; color: #666; font-size: 12px; }
          @media print { body { margin: 20px; } }
        </style>
        """;

    public static byte[] Generate(
        PayrollEntry payrollEntry,
        string employeeName,
        string employeeCode,
        string departmentName)
    {
        var issuedAt = DateTime.UtcNow.ToString("yyyy/MM/dd HH:mm", CultureInfo.InvariantCulture);
        var period = $"{payrollEntry.Year}/{payrollEntry.Month:00}";
        var baseSalary = payrollEntry.BaseSalary.ToString("N0", FaCulture);
        var grossAmount = payrollEntry.GrossAmount.ToString("N0", FaCulture);
        var deductions = payrollEntry.Deductions.ToString("N0", FaCulture);
        var netAmount = payrollEntry.NetAmount.ToString("N0", FaCulture);
        var notesRow = string.IsNullOrWhiteSpace(payrollEntry.Notes)
            ? string.Empty
            : "<tr><th>یادداشت</th><td>" + Encode(payrollEntry.Notes) + "</td></tr>";

        var html = new StringBuilder(2048);
        html.Append("<!DOCTYPE html><html lang=\"fa\" dir=\"rtl\"><head><meta charset=\"utf-8\" />");
        html.Append("<title>فیش حقوقی ").Append(Encode(employeeCode)).Append(" - ").Append(period).Append("</title>");
        html.Append(Styles);
        html.Append("</head><body>");
        html.Append("<h1>فیش حقوقی</h1>");
        html.Append("<p class=\"subtitle\">دوره: ").Append(period).Append("</p>");
        html.Append("<table>");
        html.Append("<tr><th>نام کارمند</th><td>").Append(Encode(employeeName)).Append("</td></tr>");
        html.Append("<tr><th>کد پرسنلی</th><td>").Append(Encode(employeeCode)).Append("</td></tr>");
        html.Append("<tr><th>دپارتمان</th><td>").Append(Encode(departmentName)).Append("</td></tr>");
        html.Append("<tr><th>حقوق پایه</th><td>").Append(baseSalary).Append(" ریال</td></tr>");
        html.Append("<tr><th>ناخالص</th><td>").Append(grossAmount).Append(" ریال</td></tr>");
        html.Append("<tr><th>کسورات</th><td>").Append(deductions).Append(" ریال</td></tr>");
        html.Append("<tr><th>خالص پرداختی</th><td class=\"net\">").Append(netAmount).Append(" ریال</td></tr>");
        html.Append(notesRow);
        html.Append("</table>");
        html.Append("<p class=\"footer\">تاریخ صدور: ").Append(issuedAt).Append(" — برای ذخیره PDF از Ctrl+P استفاده کنید.</p>");
        html.Append("</body></html>");

        return Encoding.UTF8.GetBytes(html.ToString());
    }

    private static string Encode(string value)
        => WebUtility.HtmlEncode(value);
}
