using SimbianSystems.Server.Application.DTOs.Auth;

namespace SimbianSystems.Server.Application.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);
    Task LogoutAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default);
    Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default);
    Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default);
    Task ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken = default);
    Task<ProfileDto> GetProfileAsync(CancellationToken cancellationToken = default);
    Task<ProfileDto> UpdateProfileAsync(ProfileDto request, CancellationToken cancellationToken = default);
}
