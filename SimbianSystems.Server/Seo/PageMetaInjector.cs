using System.Net;
using System.Text.RegularExpressions;

namespace SimbianSystems.Server.Seo;

public sealed record SeoDocument(
    string Title,
    string Description,
    string Keywords,
    string Canonical,
    string Heading,
    string Summary,
    string OgType = "website",
    string? Image = null,
    string? Robots = null);

public static class PageMetaInjector
{
    public const string HideCss =
        "#seo-content{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}img{color:transparent;font-size:0}";

    public const string ContentStyle =
        "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";

    public static string Apply(string html, SeoDocument document, bool ensureBody)
    {
        var next = EnsureHideStyle(html);
        next = UpsertTitle(next, document.Title);
        next = UpsertMeta(next, "name", "description", document.Description);
        next = UpsertMeta(next, "name", "keywords", document.Keywords);
        next = UpsertCanonical(next, document.Canonical);
        next = UpsertMeta(next, "property", "og:title", document.Title);
        next = UpsertMeta(next, "property", "og:description", document.Description);
        next = UpsertMeta(next, "property", "og:url", document.Canonical);
        next = UpsertMeta(next, "property", "og:type", document.OgType);
        next = UpsertMeta(next, "name", "twitter:card", string.IsNullOrWhiteSpace(document.Image) ? "summary" : "summary_large_image");
        next = UpsertMeta(next, "name", "twitter:title", document.Title);
        next = UpsertMeta(next, "name", "twitter:description", document.Description);
        if (!string.IsNullOrWhiteSpace(document.Image))
        {
            next = UpsertMeta(next, "property", "og:image", document.Image);
            next = UpsertMeta(next, "name", "twitter:image", document.Image);
        }
        if (!string.IsNullOrWhiteSpace(document.Robots))
            next = UpsertMeta(next, "name", "robots", document.Robots);
        if (ensureBody && RootIsEmpty(next))
            next = InjectCrawlerBody(next, document.Heading, $"<p>{Encode(document.Summary)}</p>");
        return next;
    }

    public static string SetCrawlerContent(string html, string heading, string innerHtml)
    {
        var block =
            $"<main id=\"seo-content\" aria-hidden=\"true\" style=\"{ContentStyle}\"><h1>{Encode(heading)}</h1>{innerHtml}</main>";
        if (Regex.IsMatch(html, "<main\\s+id\\s*=\\s*[\"']seo-content[\"']", RegexOptions.IgnoreCase))
        {
            return Regex.Replace(
                html,
                "<main\\s+id\\s*=\\s*[\"']seo-content[\"'][^>]*>[\\s\\S]*?</main>",
                block,
                RegexOptions.IgnoreCase);
        }

        return InjectCrawlerBody(EnsureHideStyle(html), heading, innerHtml);
    }

    public static string EnsureHideStyle(string html)
    {
        var tag = $"<style id=\"seo-content-hide\">{HideCss}</style>";
        if (Regex.IsMatch(html, "id\\s*=\\s*[\"']seo-content-hide[\"']", RegexOptions.IgnoreCase))
        {
            return Regex.Replace(
                html,
                "<style\\s+id\\s*=\\s*[\"']seo-content-hide[\"'][^>]*>[\\s\\S]*?</style>",
                tag,
                RegexOptions.IgnoreCase);
        }

        return InsertBeforeHeadEnd(html, tag);
    }

    public static string StripHtml(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "";
        var text = Regex.Replace(value, "<[^>]+>", " ");
        return Regex.Replace(text, "\\s+", " ").Trim();
    }

    private static bool RootIsEmpty(string html)
    {
        var match = Regex.Match(
            html,
            "<div\\s+id\\s*=\\s*[\"']root[\"']\\s*>(?<inner>[\\s\\S]*?)</div>",
            RegexOptions.IgnoreCase);
        return match.Success && string.IsNullOrWhiteSpace(match.Groups["inner"].Value);
    }

    private static string InjectCrawlerBody(string html, string heading, string innerHtml)
    {
        var block =
            $"<main id=\"seo-content\" aria-hidden=\"true\" style=\"{ContentStyle}\"><h1>{Encode(heading)}</h1>{innerHtml}</main>";
        if (!Regex.IsMatch(html, "<div\\s+id\\s*=\\s*[\"']root[\"']\\s*>\\s*</div>", RegexOptions.IgnoreCase))
            return html.Contains("</body>", StringComparison.OrdinalIgnoreCase)
                ? Regex.Replace(html, "</body>", $"{block}</body>", RegexOptions.IgnoreCase)
                : html + block;

        return Regex.Replace(
            html,
            "<div\\s+id\\s*=\\s*[\"']root[\"']\\s*>\\s*</div>",
            $"<div id=\"root\">{block}</div>",
            RegexOptions.IgnoreCase);
    }

    private static string UpsertTitle(string html, string title)
    {
        var tag = $"<title>{Encode(title)}</title>";
        if (Regex.IsMatch(html, "<title>[\\s\\S]*?</title>", RegexOptions.IgnoreCase))
            return Regex.Replace(html, "<title>[\\s\\S]*?</title>", tag, RegexOptions.IgnoreCase);
        return InsertBeforeHeadEnd(html, tag);
    }

    private static string UpsertCanonical(string html, string href)
    {
        var tag = $"<link rel=\"canonical\" href=\"{Encode(href)}\" />";
        if (Regex.IsMatch(html, "<link\\s+[^>]*rel\\s*=\\s*[\"']canonical[\"'][^>]*>", RegexOptions.IgnoreCase))
        {
            return Regex.Replace(
                html,
                "<link\\s+[^>]*rel\\s*=\\s*[\"']canonical[\"'][^>]*>",
                tag,
                RegexOptions.IgnoreCase);
        }

        return InsertBeforeHeadEnd(html, tag);
    }

    private static string UpsertMeta(string html, string attribute, string key, string content)
    {
        var tag = $"<meta {attribute}=\"{key}\" content=\"{Encode(content)}\" />";
        var pattern = $"<meta\\s+[^>]*{attribute}\\s*=\\s*[\"']{Regex.Escape(key)}[\"'][^>]*>";
        if (Regex.IsMatch(html, pattern, RegexOptions.IgnoreCase))
            return Regex.Replace(html, pattern, tag, RegexOptions.IgnoreCase);
        return InsertBeforeHeadEnd(html, tag);
    }

    private static string InsertBeforeHeadEnd(string html, string tag)
    {
        var index = html.IndexOf("</head>", StringComparison.OrdinalIgnoreCase);
        if (index < 0)
            return tag + html;
        return html.Insert(index, $"    {tag}\n  ");
    }

    private static string Encode(string? value) => WebUtility.HtmlEncode(value ?? "");
}
