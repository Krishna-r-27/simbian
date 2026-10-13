namespace SimbianSystems.Server.Application.Interfaces;

public interface IJwtTokenService
{
    string CreateAccessToken(string userId, string email, IEnumerable<string> roles, bool mustChangePassword = false);
    string CreateRefreshToken();
    DateTime GetAccessTokenExpiry();
    DateTime GetRefreshTokenExpiry(bool rememberMe = false);
}
