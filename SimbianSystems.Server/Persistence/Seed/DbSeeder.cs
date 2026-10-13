using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Domain.Enums;
using SimbianSystems.Server.Persistence.Context;

namespace SimbianSystems.Server.Persistence.Seed;

public static class DbSeeder
{
    public const string AdminRole = "Admin";

    public static async Task SeedAsync(AppDbContext db, CancellationToken ct = default)
    {
        if (!await db.Admins.AnyAsync(ct))
        {
            var admin = new Admin
            {
                Username = "admin",
                Email = "admin@simbiansystems.com",
                CreatedOn = DateTime.UtcNow
            };
            admin.PasswordHash = new PasswordHasher<Admin>().HashPassword(admin, "7fqhit2V-3KN");
            db.Admins.Add(admin);
        }

        if (!await db.Categories.AnyAsync(ct))
        {
            var cats = new (string Name, string Icon)[]
            {
                ("Desktop Computers", "Monitor"),
                ("Business Laptops", "Laptop"),
                ("Enterprise Servers", "Server"),
                ("Storage Solutions", "HardDrive"),
                ("Networking Equipment", "Network"),
                ("Printers & Scanners", "Printer"),
                ("UPS & Power Backup", "Zap"),
                ("Security & Surveillance", "Shield")
            };

            db.Categories.AddRange(cats.Select((x, i) => new Category
            {
                Name = x.Name,
                Slug = SlugHelper.Generate(x.Name),
                Icon = x.Icon,
                DisplayOrder = i + 1,
                IsActive = true
            }));
        }

        if (!await db.SpecificationGroups.AnyAsync(ct))
        {
            var names = new[] { "General", "Processor", "Memory", "Storage", "Display", "Networking", "Power", "Security", "Ports", "Warranty" };
            db.SpecificationGroups.AddRange(names.Select((n, i) => new SpecificationGroup
            {
                Name = n,
                DisplayOrder = i + 1,
                IsActive = true
            }));
        }

        await db.SaveChangesAsync(ct);

        if (!await db.SpecificationDefinitions.AnyAsync(ct))
        {
            var categories = await db.Categories.OrderBy(x => x.DisplayOrder).ToListAsync(ct);
            var groups = await db.SpecificationGroups.ToDictionaryAsync(x => x.Name, x => x.Id, ct);

            void Add(int catId, string group, string name, int order, ControlType type, bool required = false, string? options = null)
            {
                db.SpecificationDefinitions.Add(new SpecificationDefinition
                {
                    CategoryId = catId,
                    SpecificationGroupId = groups[group],
                    Name = name,
                    DisplayOrder = order,
                    ControlType = type,
                    IsRequired = required,
                    OptionsJson = options
                });
            }

            foreach (var cat in categories)
            {
                Add(cat.Id, "General", "Brand", 1, ControlType.Textbox, true);
                Add(cat.Id, "Warranty", "Warranty Period", 1, ControlType.Dropdown, false, "[\"1 Year\",\"2 Years\",\"3 Years\"]");
            }

            var desktops = categories.First(c => c.Slug.Contains("desktop"));
            Add(desktops.Id, "Processor", "Processor", 1, ControlType.Textbox, true);
            Add(desktops.Id, "Memory", "RAM", 1, ControlType.Dropdown, true, "[\"8GB\",\"16GB\",\"32GB\"]");
            Add(desktops.Id, "Storage", "Storage", 1, ControlType.Textbox, true);
            Add(desktops.Id, "General", "Graphics Card", 2, ControlType.Textbox);
            Add(desktops.Id, "General", "Operating System", 3, ControlType.Textbox);
            Add(desktops.Id, "Power", "Power Supply", 1, ControlType.Textbox);

            var laptops = categories.First(c => c.Slug.Contains("laptop"));
            Add(laptops.Id, "Processor", "Processor", 1, ControlType.Textbox, true);
            Add(laptops.Id, "Memory", "RAM", 1, ControlType.Dropdown, true, "[\"8GB\",\"16GB\",\"32GB\"]");
            Add(laptops.Id, "Storage", "SSD", 1, ControlType.Textbox, true);
            Add(laptops.Id, "Display", "Display Size", 1, ControlType.Textbox);
            Add(laptops.Id, "General", "Weight", 2, ControlType.Textbox);
            Add(laptops.Id, "Power", "Battery", 1, ControlType.Textbox);

            var servers = categories.First(c => c.Slug.Contains("server"));
            Add(servers.Id, "Processor", "CPU", 1, ControlType.Textbox, true);
            Add(servers.Id, "Processor", "Socket", 2, ControlType.Textbox);
            Add(servers.Id, "Memory", "Memory Slots", 1, ControlType.Number);
            Add(servers.Id, "Memory", "ECC Memory", 2, ControlType.YesNo);
            Add(servers.Id, "Storage", "RAID", 1, ControlType.Textbox);
            Add(servers.Id, "General", "Rack Size", 2, ControlType.Dropdown, false, "[\"1U\",\"2U\",\"4U\"]");

            var networking = categories.First(c => c.Slug.Contains("network"));
            Add(networking.Id, "Ports", "Ports", 1, ControlType.Textbox, true);
            Add(networking.Id, "Networking", "Switch Type", 1, ControlType.Textbox);
            Add(networking.Id, "Networking", "PoE", 2, ControlType.YesNo);
            Add(networking.Id, "Networking", "Layer", 3, ControlType.Dropdown, false, "[\"Layer 2\",\"Layer 3\"]");
            Add(networking.Id, "Networking", "Throughput", 4, ControlType.Textbox);

            var printers = categories.First(c => c.Slug.Contains("printer"));
            Add(printers.Id, "General", "Technology", 2, ControlType.Textbox, true);
            Add(printers.Id, "General", "Print Speed", 3, ControlType.Textbox);
            Add(printers.Id, "General", "Paper Size", 4, ControlType.Textbox);
            Add(printers.Id, "General", "ADF", 5, ControlType.YesNo);

            var ups = categories.First(c => c.Slug.Contains("ups") || c.Slug.Contains("power"));
            Add(ups.Id, "Power", "Capacity", 1, ControlType.Textbox, true);
            Add(ups.Id, "Power", "Battery", 2, ControlType.Textbox);
            Add(ups.Id, "Power", "Backup Time", 3, ControlType.Textbox);
            Add(ups.Id, "Power", "Input Voltage", 4, ControlType.Textbox);
            Add(ups.Id, "Power", "Output Voltage", 5, ControlType.Textbox);

            var security = categories.First(c => c.Slug.Contains("security"));
            Add(security.Id, "Security", "Camera Resolution", 1, ControlType.Textbox, true);
            Add(security.Id, "Security", "Lens", 2, ControlType.Textbox);
            Add(security.Id, "Security", "Night Vision", 3, ControlType.YesNo);
            Add(security.Id, "Storage", "Storage", 1, ControlType.Textbox);
            Add(security.Id, "Networking", "PoE", 1, ControlType.YesNo);
            Add(security.Id, "General", "Weather Rating", 2, ControlType.Textbox);

            await db.SaveChangesAsync(ct);
        }
    }
}
