using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Auth;
using SimbianSystems.Server.Application.Interfaces.Services;

namespace SimbianSystems.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService) => _authService = authService;

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request, CancellationToken ct)
        => Ok(ApiResponse<LoginResponse>.Ok(await _authService.LoginAsync(request, ct)));

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<LoginResponse>>> Refresh([FromBody] RefreshTokenRequest request, CancellationToken ct)
        => Ok(ApiResponse<LoginResponse>.Ok(await _authService.RefreshTokenAsync(request, ct)));

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<object>>> ForgotPassword([FromBody] ForgotPasswordRequest request, CancellationToken ct)
    {
        await _authService.ForgotPasswordAsync(request, ct);
        return Ok(ApiResponse.Ok("If the email exists, a reset link has been sent."));
    }

    [AllowAnonymous]
    [EnableRateLimiting("auth")]
    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<object>>> ResetPassword([FromBody] ResetPasswordRequest request, CancellationToken ct)
    {
        await _authService.ResetPasswordAsync(request, ct);
        return Ok(ApiResponse.Ok("Password has been reset."));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request, CancellationToken ct)
    {
        await _authService.ChangePasswordAsync(request, ct);
        return Ok(ApiResponse.Ok("Password changed successfully."));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<object>>> Logout([FromBody] RefreshTokenRequest request, CancellationToken ct)
    {
        await _authService.LogoutAsync(request, ct);
        return Ok(ApiResponse.Ok("Logged out."));
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> GetProfile(CancellationToken ct)
        => Ok(ApiResponse<ProfileDto>.Ok(await _authService.GetProfileAsync(ct)));

    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<ProfileDto>>> UpdateProfile([FromBody] ProfileDto request, CancellationToken ct)
        => Ok(ApiResponse<ProfileDto>.Ok(await _authService.UpdateProfileAsync(request, ct)));
}
