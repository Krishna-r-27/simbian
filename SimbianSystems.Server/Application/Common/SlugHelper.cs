using System.Text;
using System.Text.RegularExpressions;

namespace SimbianSystems.Server.Application.Common;

public static class SlugHelper
{
    public static string Generate(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
            return string.Empty;

        var value = input.Trim().ToLowerInvariant();
        value = value.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in value)
        {
            var uc = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (uc != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        value = sb.ToString().Normalize(NormalizationForm.FormC);
        value = Regex.Replace(value, @"[^a-z0-9\s-]", "");
        value = Regex.Replace(value, @"\s+", "-").Trim('-');
        value = Regex.Replace(value, @"-+", "-");
        return value;
    }
}
