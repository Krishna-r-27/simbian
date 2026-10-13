using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Application.Mapping;
using SimbianSystems.Server.Application.Services;
namespace SimbianSystems.Server.Application;
public static class DependencyInjection {
 public static IServiceCollection AddApplication(this IServiceCollection services){
  services.AddAutoMapper(typeof(MappingProfile).Assembly);services.AddValidatorsFromAssembly(typeof(MappingProfile).Assembly);
  services.AddScoped<IProductService, ProductService>();
  services.AddScoped<ISpecService, SpecService>();
  services.AddScoped<IEnquiryService, EnquiryService>();
  services.AddScoped<IProductQuoteService, ProductQuoteService>();
  services.AddScoped<IDashboardService, DashboardService>();
  services.AddScoped<IPublicCatalogService, PublicCatalogService>();
  return services;
 }
}
