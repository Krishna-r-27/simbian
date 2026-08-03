using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Persistence.Context;
using SimbianSystems.Server.Persistence.Repositories;

namespace SimbianSystems.Server.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is required.");

        ServerVersion serverVersion;
        try
        {
            serverVersion = ServerVersion.AutoDetect(connectionString);
        }
        catch
        {
            serverVersion = new MySqlServerVersion(new Version(8, 0, 36));
        }

        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, serverVersion));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }
}
