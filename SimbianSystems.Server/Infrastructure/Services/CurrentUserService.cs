using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using SimbianSystems.Server.Application.Interfaces;

namespace SimbianSystems.Server.Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public string? UserId =>
        User?.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? User?.FindFirstValue(JwtRegisteredClaimNames.Sub);

    public string? Email =>
        User?.FindFirstValue(ClaimTypes.Email)
        ?? User?.FindFirstValue(JwtRegisteredClaimNames.Email);

    public string? UserName =>
        User?.Identity?.Name
        ?? User?.FindFirstValue(ClaimTypes.Name)
        ?? Email;

    public string? IpAddress
    {
        get
        {
            var context = _httpContextAccessor.HttpContext;
            if (context is null)
                return null;

            var forwarded = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrWhiteSpace(forwarded))
                return forwarded.Split(',')[0].Trim();

            return context.Connection.RemoteIpAddress?.ToString();
        }
    }

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated == true;

    private ClaimsPrincipal? User => _httpContextAccessor.HttpContext?.User;
}
