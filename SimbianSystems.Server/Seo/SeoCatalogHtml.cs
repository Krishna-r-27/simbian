using System.Net;
using System.Text;
using SimbianSystems.Server.Application.DTOs.Products;

namespace SimbianSystems.Server.Seo;

public static class SeoCatalogHtml
{
    public static string GroupedProducts(
        string? intro,
        IReadOnlyList<CategoryDto> categories,
        IReadOnlyList<ProductListItemDto> products)
    {
        var builder = new StringBuilder();
        if (!string.IsNullOrWhiteSpace(intro))
            builder.Append("<p>").Append(Encode(intro)).Append("</p>");

        var groups = products
            .GroupBy(product => product.CategorySlug, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(group => group.Key, group => group.ToList(), StringComparer.OrdinalIgnoreCase);
        var written = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var category in categories)
        {
            if (!groups.TryGetValue(category.Slug, out var items))
                continue;
            AppendGroup(builder, category.Name, category.Slug, items);
            written.Add(category.Slug);
        }

        foreach (var group in groups)
        {
            if (written.Contains(group.Key))
                continue;
            var name = group.Value.FirstOrDefault()?.CategoryName;
            AppendGroup(builder, string.IsNullOrWhiteSpace(name) ? group.Key : name, group.Key, group.Value);
        }

        return builder.ToString();
    }

    public static string Sitemap(
        IEnumerable<SeoRouteEntry> routes,
        IReadOnlyList<CategoryDto> categories,
        IReadOnlyList<ProductListItemDto> products)
    {
        var builder = new StringBuilder();
        builder.Append("<p>Published pages and products on Simbian Systems.</p><h2>Pages</h2><ul>");
        foreach (var route in routes.Where(route => route.Sitemap))
        {
            var path = string.IsNullOrWhiteSpace(route.Path) ? "/" : route.Path;
            var label = string.IsNullOrWhiteSpace(route.Heading) ? path : route.Heading;
            builder.Append("<li><a href=\"").Append(Encode(path)).Append("\">")
                .Append(Encode(label)).Append("</a></li>");
        }
        builder.Append("</ul>");
        builder.Append(GroupedProducts(null, categories, products));
        return builder.ToString();
    }

    private static void AppendGroup(
        StringBuilder builder,
        string name,
        string slug,
        IReadOnlyList<ProductListItemDto> items)
    {
        builder.Append("<h2><a href=\"/products/").Append(Encode(slug)).Append("\">")
            .Append(Encode(name)).Append("</a></h2><ul>");
        foreach (var product in items.OrderBy(item => item.DisplayOrder).ThenBy(item => item.Name))
        {
            builder.Append("<li><a href=\"/products/")
                .Append(Encode(product.CategorySlug)).Append('/').Append(Encode(product.Slug))
                .Append("\">").Append(Encode(product.Name)).Append("</a></li>");
        }
        builder.Append("</ul>");
    }

    private static string Encode(string? value) => WebUtility.HtmlEncode(value ?? "");
}
