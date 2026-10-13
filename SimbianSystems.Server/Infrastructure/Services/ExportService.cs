using System.Globalization;
using System.Text;
using ClosedXML.Excel;
using SimbianSystems.Server.Application.Interfaces;

namespace SimbianSystems.Server.Infrastructure.Services;

public class ExportService : IExportService
{
    public byte[] ExportToCsv<T>(IEnumerable<T> data, IEnumerable<(string Header, Func<T, object?> Selector)> columns)
    {
        var cols = columns.ToList();
        var sb = new StringBuilder();
        sb.AppendLine(string.Join(',', cols.Select(c => EscapeCsv(c.Header))));

        foreach (var item in data)
        {
            var values = cols.Select(c => EscapeCsv(FormatValue(c.Selector(item))));
            sb.AppendLine(string.Join(',', values));
        }

        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
    }

    public byte[] ExportToExcel<T>(
        IEnumerable<T> data,
        IEnumerable<(string Header, Func<T, object?> Selector)> columns,
        string sheetName = "Sheet1")
    {
        var cols = columns.ToList();
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add(string.IsNullOrWhiteSpace(sheetName) ? "Sheet1" : sheetName);

        for (var i = 0; i < cols.Count; i++)
            worksheet.Cell(1, i + 1).Value = cols[i].Header;

        var row = 2;
        foreach (var item in data)
        {
            for (var i = 0; i < cols.Count; i++)
            {
                var value = cols[i].Selector(item);
                worksheet.Cell(row, i + 1).Value = FormatExcelValue(value);
            }

            row++;
        }

        worksheet.Columns().AdjustToContents();

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        return stream.ToArray();
    }

    private static string FormatValue(object? value)
    {
        if (value is null)
            return string.Empty;

        return value switch
        {
            DateTime dt => dt.ToString("o", CultureInfo.InvariantCulture),
            DateTimeOffset dto => dto.ToString("o", CultureInfo.InvariantCulture),
            IFormattable formattable => formattable.ToString(null, CultureInfo.InvariantCulture) ?? string.Empty,
            _ => value.ToString() ?? string.Empty
        };
    }

    private static XLCellValue FormatExcelValue(object? value) =>
        value switch
        {
            null => Blank.Value,
            string s => s,
            bool b => b,
            byte n => n,
            short n => n,
            int n => n,
            long n => n,
            float n => n,
            double n => n,
            decimal n => n,
            DateTime dt => dt,
            DateTimeOffset dto => dto.UtcDateTime,
            _ => FormatValue(value)
        };

    private static string EscapeCsv(string value)
    {
        if (value.Contains('"') || value.Contains(',') || value.Contains('\n') || value.Contains('\r'))
            return $"\"{value.Replace("\"", "\"\"")}\"";

        return value;
    }
}
