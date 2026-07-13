using System.Text;
using JavidHrm.Domain.Entities;

namespace JavidHrm.Application.Services.Payroll;

public static class PayslipHtmlGenerator
{
    public static byte[] Generate(
        PayrollEntry payrollEntry,
        string employeeName,
        string employeeCode,
        string departmentName)
    {
        var issuedAt = DateTime.UtcNow.ToString("yyyy/MM/dd HH:mm");
        var html = $"""
            <!DOCTYPE html>
            <html lang="fa" dir="rtl">
            <head>
              <meta charset="utf-8" />
              <title>فیش حقوقی {employeeCode} - {payrollEntry.Year}/{payrollEntry.Month:D2}</title>
              <style>
                body {{
                  font-family: Tahoma, 'Segoe UI', sans-serif;
                  margin: 40px;
                  color: #111;
                  line-height: 1.7;
                }}
                h1 {{
                  text-align: center;
                  margin-bottom: 4px;
                }}
                .subtitle {{
                  text-align: center;
                  color: #555;
                  margin-bottom: 28px;
                }}
                table {{
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 16px;
                }}
                th, td {{
                  border: 1px solid #ccc;
                  padding: 10px 12px;
                  text-align: right;
                }}
                th {{
                  background: #f5f5f5;
                  width: 35%;
                }}
                .net {{
                  font-weight: bold;
                  font-size: 1.1em;
                }}
                .footer {{
                  margin-top: 32px;
                  text-align: center;
                  color: #666;
                  font-size: 12px;
                }}
                @media print {{
                  body {{ margin: 20px; }}
                }}
              </style>
            </head>
            <body>
              <h1>فیش حقوقی</h1>
              <p class="subtitle">دوره: {payrollEntry.Year}/{payrollEntry.Month:D2}</p>
              <table>
                <tr><th>نام کارمند</th><td>{Encode(employeeName)}</td></tr>
                <tr><th>کد پرسنلی</th><td>{Encode(employeeCode)}</td></tr>
                <tr><th>دپارتمان</th><td>{Encode(departmentName)}</td></tr>
                <tr><th>حقوق پایه</th><td>{payrollEntry.BaseSalary:N0} ریال</td></tr>
                <tr><th>ناخالص</th><td>{payrollEntry.GrossAmount:N0} ریال</td></tr>
                <tr><th>کسورات</th><td>{payrollEntry.Deductions:N0} ریال</td></tr>
                <tr><th>خالص پرداختی</th><td class="net">{payrollEntry.NetAmount:N0} ریال</td></tr>
                {(string.IsNullOrWhiteSpace(payrollEntry.Notes)
                    ? string.Empty
                    : $"<tr><th>یادداشت</th><td>{Encode(payrollEntry.Notes)}</td></tr>")}
              </table>
              <p class="footer">تاریخ صدور: {issuedAt} — برای ذخیره PDF از Ctrl+P استفاده کنید.</p>
            </body>
            </html>
            """;

        return Encoding.UTF8.GetBytes(html);
    }

    private static string Encode(string value)
        => System.Net.WebUtility.HtmlEncode(value);
}
