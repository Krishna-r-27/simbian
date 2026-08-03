using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SimbianSystems.Server.Application.Common;
using SimbianSystems.Server.Application.DTOs.Auth;
using SimbianSystems.Server.Application.Interfaces;
using SimbianSystems.Server.Application.Interfaces.Services;
using SimbianSystems.Server.Domain.Entities;
using SimbianSystems.Server.Persistence.Context;
using SimbianSystems.Server.Persistence.Seed;

namespace SimbianSystems.Server.Infrastructure.Services;

public class AuthService : IAuthService
{
    private static readonly string[] AdminRoles = [DbSeeder.AdminRole];

    private readonly AppDbContext _db;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IEmailService _emailService;
    private readonly ICurrentUserService _currentUser;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly PasswordHasher<Admin> _passwordHasher = new();

    public AuthService(
        AppDbContext db,
        IJwtTokenService jwtTokenService,
        IEmailService emailService,
        ICurrentUserService currentUser,
        IConfiguration configuration,
        ILogger<AuthService> logger)
    {
        _db = db;
        _jwtTokenService = jwtTokenService;
        _emailService = emailService;
        _currentUser = currentUser;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.UsernameOrEmail) || string.IsNullOrWhiteSpace(request.Password))
            throw AppException.Unauthorized("Invalid username/email or password.");

        var admin = await FindAdminByUsernameOrEmailAsync(request.UsernameOrEmail, cancellationToken)
                    ?? throw AppException.Unauthorized("Invalid username/email or password.");

        if (string.IsNullOrWhiteSpace(admin.PasswordHash))
            throw AppException.Unauthorized("Invalid username/email or password.");

        var verify = _passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw AppException.Unauthorized("Invalid username/email or password.");

        if (verify == PasswordVerificationResult.SuccessRehashNeeded)
        {
            admin.PasswordHash = _passwordHasher.HashPassword(admin, request.Password);
            admin.UpdatedOn = DateTime.UtcNow;
            await _db.SaveChangesAsync(cancellationToken);
        }

        return await IssueTokensAsync(admin, request.RememberMe, cancellationToken);
    }

    public async Task<LoginResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var existing = await _db.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == request.RefreshToken, cancellationToken)
            ?? throw AppException.Unauthorized("Invalid refresh token.");

        if (!existing.IsActive)
            throw AppException.Unauthorized("Refresh token is expired or revoked.");

        if (!int.TryParse(existing.UserId, out var adminId))
            throw AppException.Unauthorized("User not found.");

        var admin = await _db.Admins.FirstOrDefaultAsync(x => x.Id == adminId, cancellationToken)
                    ?? throw AppException.Unauthorized("User not found.");

        var remaining = existing.ExpiresAt - DateTime.UtcNow;
        var rememberMe = remaining > TimeSpan.FromDays(7);

        var newRefresh = _jwtTokenService.CreateRefreshToken();
        existing.RevokedAt = DateTime.UtcNow;
        existing.RevokedByIp = _currentUser.IpAddress;
        existing.ReplacedByToken = newRefresh;
        existing.ReasonRevoked = "Replaced by new token";

        var refreshExpires = _jwtTokenService.GetRefreshTokenExpiry(rememberMe);
        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = admin.Id.ToString(),
            Token = newRefresh,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = refreshExpires,
            CreatedByIp = _currentUser.IpAddress
        });

        await _db.SaveChangesAsync(cancellationToken);

        var accessExpires = _jwtTokenService.GetAccessTokenExpiry();
        var accessToken = _jwtTokenService.CreateAccessToken(admin.Id.ToString(), admin.Email, AdminRoles);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = newRefresh,
            AccessTokenExpiresAt = accessExpires,
            RefreshTokenExpiresAt = refreshExpires,
            Profile = MapProfile(admin)
        };
    }

    public async Task LogoutAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            return;

        var existing = await _db.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == request.RefreshToken, cancellationToken);

        if (existing is null || !existing.IsActive)
            return;

        existing.RevokedAt = DateTime.UtcNow;
        existing.RevokedByIp = _currentUser.IpAddress;
        existing.ReasonRevoked = "Logout";
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var email = request.Email.Trim();
        var admin = await _db.Admins
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower(), cancellationToken);

        if (admin is null)
            return;

        var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        admin.ResetToken = token;
        admin.ResetTokenExpires = DateTime.UtcNow.AddHours(1);
        admin.UpdatedOn = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);

        var frontendBase = _configuration["App:FrontendBaseUrl"]?.TrimEnd('/') ?? "https://localhost:60679";
        var resetUrl =
            $"{frontendBase}/poweradmin/reset-password?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(admin.Email)}";

        _logger.LogInformation("Password reset link for {Email}: {ResetUrl}", admin.Email, resetUrl);

        var body = $"""
            <p>Hello {admin.DisplayName},</p>
            <p>A password reset was requested for your Simbian Systems admin account.</p>
            <p><a href="{resetUrl}">Reset your password</a></p>
            <p>This link expires in 1 hour.</p>
            """;

        await _emailService.SendAsync(admin.Email, "Reset your password", body, cancellationToken);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        if (request.NewPassword != request.ConfirmPassword)
            throw AppException.BadRequest("New password and confirmation do not match.");

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            throw AppException.BadRequest("Password must be at least 8 characters.");

        var email = request.Email.Trim();
        var token = Uri.UnescapeDataString(request.Token.Trim());

        var admin = await _db.Admins
            .FirstOrDefaultAsync(x => x.Email.ToLower() == email.ToLower(), cancellationToken)
            ?? throw AppException.BadRequest("Invalid password reset request.");

        if (string.IsNullOrWhiteSpace(admin.ResetToken)
            || !string.Equals(admin.ResetToken, token, StringComparison.Ordinal)
            || admin.ResetTokenExpires is null
            || admin.ResetTokenExpires < DateTime.UtcNow)
        {
            throw AppException.BadRequest("Invalid or expired password reset token.");
        }

        admin.PasswordHash = _passwordHasher.HashPassword(admin, request.NewPassword);
        admin.ResetToken = null;
        admin.ResetTokenExpires = null;
        admin.UpdatedOn = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        await RevokeUserRefreshTokensAsync(admin.Id.ToString(), "Password reset", cancellationToken);
    }

    public async Task ChangePasswordAsync(ChangePasswordRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_currentUser.UserId))
            throw AppException.Unauthorized();

        if (request.NewPassword != request.ConfirmPassword)
            throw AppException.BadRequest("New password and confirmation do not match.");

        if (string.IsNullOrWhiteSpace(request.NewPassword) || request.NewPassword.Length < 8)
            throw AppException.BadRequest("Password must be at least 8 characters.");

        if (!int.TryParse(_currentUser.UserId, out var adminId))
            throw AppException.Unauthorized();

        var admin = await _db.Admins.FirstOrDefaultAsync(x => x.Id == adminId, cancellationToken)
                    ?? throw AppException.Unauthorized();

        if (_passwordHasher.VerifyHashedPassword(admin, admin.PasswordHash, request.CurrentPassword)
            == PasswordVerificationResult.Failed)
        {
            throw AppException.BadRequest("Current password is incorrect.");
        }

        admin.PasswordHash = _passwordHasher.HashPassword(admin, request.NewPassword);
        admin.UpdatedOn = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        await RevokeUserRefreshTokensAsync(admin.Id.ToString(), "Password changed", cancellationToken);
    }

    public async Task<ProfileDto> GetProfileAsync(CancellationToken cancellationToken = default)
    {
        var admin = await GetCurrentAdminAsync(cancellationToken);
        return MapProfile(admin);
    }

    public async Task<ProfileDto> UpdateProfileAsync(ProfileDto request, CancellationToken cancellationToken = default)
    {
        var admin = await GetCurrentAdminAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(request.UserName))
            admin.Username = request.UserName.Trim();

        if (!string.IsNullOrWhiteSpace(request.Email))
            admin.Email = request.Email.Trim();

        admin.UpdatedOn = DateTime.UtcNow;
        await _db.SaveChangesAsync(cancellationToken);
        return MapProfile(admin);
    }

    private async Task<LoginResponse> IssueTokensAsync(Admin admin, bool rememberMe, CancellationToken cancellationToken)
    {
        var accessExpires = _jwtTokenService.GetAccessTokenExpiry();
        var refreshExpires = _jwtTokenService.GetRefreshTokenExpiry(rememberMe);
        var accessToken = _jwtTokenService.CreateAccessToken(admin.Id.ToString(), admin.Email, AdminRoles);
        var refreshToken = _jwtTokenService.CreateRefreshToken();

        _db.RefreshTokens.Add(new RefreshToken
        {
            UserId = admin.Id.ToString(),
            Token = refreshToken,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = refreshExpires,
            CreatedByIp = _currentUser.IpAddress
        });

        await _db.SaveChangesAsync(cancellationToken);

        return new LoginResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            AccessTokenExpiresAt = accessExpires,
            RefreshTokenExpiresAt = refreshExpires,
            Profile = MapProfile(admin)
        };
    }

    private async Task<Admin?> FindAdminByUsernameOrEmailAsync(string usernameOrEmail, CancellationToken cancellationToken)
    {
        var key = usernameOrEmail.Trim().ToLowerInvariant();
        return await _db.Admins.FirstOrDefaultAsync(
            x => x.Username.ToLower() == key || x.Email.ToLower() == key,
            cancellationToken);
    }

    private async Task<Admin> GetCurrentAdminAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_currentUser.UserId) || !int.TryParse(_currentUser.UserId, out var adminId))
            throw AppException.Unauthorized();

        return await _db.Admins.FirstOrDefaultAsync(x => x.Id == adminId, cancellationToken)
               ?? throw AppException.Unauthorized();
    }

    private static ProfileDto MapProfile(Admin admin) =>
        new()
        {
            Id = admin.Id.ToString(),
            Email = admin.Email,
            UserName = admin.Username,
            FullName = admin.DisplayName,
            Roles = AdminRoles
        };

    private async Task RevokeUserRefreshTokensAsync(string userId, string reason, CancellationToken cancellationToken)
    {
        var active = await _db.RefreshTokens
            .Where(x => x.UserId == userId && x.RevokedAt == null && x.ExpiresAt > DateTime.UtcNow)
            .ToListAsync(cancellationToken);

        foreach (var token in active)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = _currentUser.IpAddress;
            token.ReasonRevoked = reason;
        }

        if (active.Count > 0)
            await _db.SaveChangesAsync(cancellationToken);
    }
}
