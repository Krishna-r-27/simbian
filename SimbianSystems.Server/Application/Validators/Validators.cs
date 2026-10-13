using FluentValidation;
using SimbianSystems.Server.Application.DTOs.Auth;
using SimbianSystems.Server.Application.DTOs.Products;

namespace SimbianSystems.Server.Application.Validators;

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.UsernameOrEmail).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
    }
}

public class ProductUpsertDtoValidator : AbstractValidator<ProductUpsertDto>
{
    public ProductUpsertDtoValidator()
    {
        RuleFor(x => x.CategoryId).GreaterThan(0);
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.ShortDescription).MaximumLength(2000);
        RuleFor(x => x.GalleryImages).Must(g => g == null || g.Count <= 12)
            .WithMessage("Maximum 12 gallery images allowed.");
    }
}

public class ProductGalleryOrderDtoValidator : AbstractValidator<ProductGalleryOrderDto>
{
    public ProductGalleryOrderDtoValidator()
    {
        RuleFor(x => x.GalleryImages).NotNull().Must(g => g.Count <= 12)
            .WithMessage("Maximum 12 gallery images allowed.");
    }
}
