namespace SimbianSystems.Server.Application.Interfaces;

public interface IExportService
{
    byte[] ExportToCsv<T>(IEnumerable<T> data, IEnumerable<(string Header, Func<T, object?> Selector)> columns);
    byte[] ExportToExcel<T>(IEnumerable<T> data, IEnumerable<(string Header, Func<T, object?> Selector)> columns, string sheetName = "Sheet1");
}
