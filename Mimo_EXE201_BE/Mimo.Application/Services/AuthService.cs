using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Mimo.Application.DTOs.Auth;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Exceptions;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Organization> _orgRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IGenericRepository<UserProfile> _profileRepository;
        private readonly IGenericRepository<UserStats> _statsRepository;
        private readonly IJwtService _jwtService;
        private readonly ICryptoService _cryptoService;
        private readonly ICacheService _cacheService;
        private readonly IGoogleAuthService _googleAuthService;
        private readonly ILogger<AuthService> _logger;
        private readonly IMailService _mailService;

        public AuthService(
            IGenericRepository<User> userRepository,
            IGenericRepository<Organization> orgRepository,
            IGenericRepository<Role> roleRepository,
            IGenericRepository<UserProfile> profileRepository,
            IGenericRepository<UserStats> statsRepository,
            IJwtService jwtService,
            ICryptoService cryptoService,
            ICacheService cacheService,
            IGoogleAuthService googleAuthService,
            IMailService mailService,
            ILogger<AuthService> logger)
        {
            _userRepository = userRepository;
            _orgRepository = orgRepository;
            _roleRepository = roleRepository;
            _profileRepository = profileRepository;
            _statsRepository = statsRepository;
            _jwtService = jwtService;
            _cryptoService = cryptoService;
            _cacheService = cacheService;
            _googleAuthService = googleAuthService;
            _mailService = mailService;
            _logger = logger;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            // 1. Kiểm tra Email đã tồn tại chưa
            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existingUser != null)
            {
                throw new ConflictException("Email này đã được sử dụng trong hệ thống.");
            }

            // 2. Gán Role mặc định là Student cho người học
            var targetRoleName = "Student";
            var roleEntity = await _roleRepository.FirstOrDefaultAsync(r => r.RoleName.ToLower() == targetRoleName.ToLower());
            if (roleEntity == null)
            {
                roleEntity = await _roleRepository.CreateAsync(new Role
                {
                    RoleName = targetRoleName,
                    Description = "Học sinh / Người học kỹ năng",
                    Status = RoleStatusEnum.Active
                });
            }

            // 3. Băm mật khẩu và tạo refresh token
            var passwordHash = _cryptoService.HashPassword(request.Password);
            var refreshToken = _cryptoService.GenerateRandomToken(32);
            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Name = request.FullName.Trim(),
                UserName = normalizedEmail.Split('@')[0],
                Email = normalizedEmail,
                Password = passwordHash,
                RoleId = roleEntity.Id,
                Role = roleEntity,
                Status = UserStatusEnum.Active,
                Phone = request.PhoneNumber,
                OrganizationId = null,
                AuthType = "Local",
                Timezone = "Asia/Ho_Chi_Minh",
                TotalXp = 0,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP)
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // 4. Tự động khởi tạo UserProfile & UserStats (5 tim mặc định)
            var profile = new UserProfile
            {
                UserId = createdUser.Id,
                FullName = createdUser.Name,
                AvatarUrl = createdUser.Avatar,
                DailyGoalMinutes = 10
            };
            await _profileRepository.CreateAsync(profile);

            var stats = new UserStats
            {
                UserId = createdUser.Id,
                Hearts = 5,
                HeartsUpdatedAt = DateTime.UtcNow,
                Streak = 0,
                StreakFreezeCount = 0,
                IsPro = false
            };
            await _statsRepository.CreateAsync(stats);

            // 5. Trả về kết quả đăng ký thành công (Không tự động đăng nhập, không tạo JWT/Redis session)
            return new RegisterResponseDto
            {
                UserId = createdUser.Id,
                Email = createdUser.Email,
                FullName = createdUser.Name,
                PhoneNumber = createdUser.Phone,
                Role = roleEntity.RoleName,
                Message = "Đăng ký tài khoản thành công! Vui lòng đăng nhập để tiếp tục.",
                CreatedAt = createdUser.CreatedAt
            };
        }

        public async Task<RegisterResponseDto> RegisterOrganizationAsync(OrganizationRegisterRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existingUser != null)
            {
                throw new ConflictException("Email này đã được sử dụng trong hệ thống.");
            }

            // 1. Tạo bản ghi độc lập trong bảng Organizations
            var orgName = request.OrganizationName.Trim();
            var orgCode = "ORG_" + _cryptoService.GenerateRandomToken(6).ToUpper();

            var newOrg = new Organization
            {
                Name = orgName,
                Code = orgCode,
                Email = normalizedEmail,
                PhoneNumber = request.PhoneNumber,
                Address = request.Address,
                Status = OrganizationStatusEnum.Active,
                SeatCount = 50,
                ExpirationDate = DateTime.UtcNow.AddYears(1)
            };

            var createdOrg = await _orgRepository.CreateAsync(newOrg);

            // 2. Gán Role Organization cho tài khoản đại diện trường
            var targetRoleName = "Organization";
            var roleEntity = await _roleRepository.FirstOrDefaultAsync(r => r.RoleName.ToLower() == targetRoleName.ToLower());
            if (roleEntity == null)
            {
                roleEntity = await _roleRepository.CreateAsync(new Role
                {
                    RoleName = targetRoleName,
                    Description = "Đại diện tổ chức / Trường học B2B",
                    Status = RoleStatusEnum.Active
                });
            }

            // 3. Tạo User cho người đại diện
            var passwordHash = _cryptoService.HashPassword(request.Password);
            var refreshToken = _cryptoService.GenerateRandomToken(32);
            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Name = request.RepresentativeName.Trim(),
                UserName = normalizedEmail.Split('@')[0],
                Email = normalizedEmail,
                Password = passwordHash,
                RoleId = roleEntity.Id,
                Role = roleEntity,
                Status = UserStatusEnum.Active,
                Phone = request.PhoneNumber,
                OrganizationId = createdOrg.Id,
                AuthType = "Local",
                Timezone = "Asia/Ho_Chi_Minh",
                TotalXp = 0,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP)
            };

            var createdUser = await _userRepository.CreateAsync(user);

            var profile = new UserProfile
            {
                UserId = createdUser.Id,
                FullName = createdUser.Name,
                AvatarUrl = createdUser.Avatar,
                DailyGoalMinutes = 15
            };
            await _profileRepository.CreateAsync(profile);

            var stats = new UserStats
            {
                UserId = createdUser.Id,
                Hearts = 5,
                HeartsUpdatedAt = DateTime.UtcNow,
                Streak = 0,
                StreakFreezeCount = 99,
                IsPro = true
            };
            await _statsRepository.CreateAsync(stats);

            // 4. Trả về kết quả đăng ký tổ chức thành công (Không tự động đăng nhập, không tạo JWT/Redis session)
            return new RegisterResponseDto
            {
                UserId = createdUser.Id,
                Email = createdUser.Email,
                FullName = createdUser.Name,
                PhoneNumber = createdUser.Phone,
                Role = roleEntity.RoleName,
                Message = "Đăng ký tổ chức trường học thành công! Vui lòng đăng nhập để tiếp tục.",
                CreatedAt = createdUser.CreatedAt
            };
        }

        public async Task<RegisterResponseDto> RegisterCuratorAsync(CuratorRegisterRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLower();

            // 1. Kiểm tra Email đã tồn tại chưa
            var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
            if (existingUser != null)
            {
                throw new ConflictException("Email này đã được sử dụng trong hệ thống.");
            }

            // 2. Gán Role Curator cho tác giả kịch bản
            var targetRoleName = "Curator";
            var roleEntity = await _roleRepository.FirstOrDefaultAsync(r => r.RoleName.ToLower() == targetRoleName.ToLower());
            if (roleEntity == null)
            {
                roleEntity = await _roleRepository.CreateAsync(new Role
                {
                    Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    RoleName = targetRoleName,
                    Description = "Giảng viên / Biên tập kịch bản bài giảng",
                    Status = RoleStatusEnum.Active
                });
            }

            // 3. Băm mật khẩu và tạo refresh token
            var passwordHash = _cryptoService.HashPassword(request.Password);
            var refreshToken = _cryptoService.GenerateRandomToken(32);
            var userId = Guid.NewGuid();

            var user = new User
            {
                Id = userId,
                Name = request.FullName.Trim(),
                UserName = normalizedEmail.Split('@')[0],
                Email = normalizedEmail,
                Password = passwordHash,
                RoleId = roleEntity.Id,
                Role = roleEntity,
                Status = UserStatusEnum.Active,
                Phone = request.PhoneNumber,
                Address = request.Specialization,
                OrganizationId = null,
                AuthType = "Local",
                Timezone = "Asia/Ho_Chi_Minh",
                TotalXp = 0,
                RefreshToken = refreshToken,
                RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP)
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // 4. Khởi tạo UserProfile & UserStats (Không giới hạn tim cho tác giả)
            var profile = new UserProfile
            {
                UserId = createdUser.Id,
                FullName = createdUser.Name,
                AvatarUrl = createdUser.Avatar,
                DailyGoalMinutes = 15
            };
            await _profileRepository.CreateAsync(profile);

            var stats = new UserStats
            {
                UserId = createdUser.Id,
                Hearts = 5,
                HeartsUpdatedAt = DateTime.UtcNow,
                Streak = 0,
                StreakFreezeCount = 10,
                IsPro = true
            };
            await _statsRepository.CreateAsync(stats);

            return new RegisterResponseDto
            {
                UserId = createdUser.Id,
                Email = createdUser.Email,
                FullName = createdUser.Name,
                PhoneNumber = createdUser.Phone,
                Role = roleEntity.RoleName,
                Message = "Đăng ký tài khoản tác giả / biên tập viên thành công! Vui lòng đăng nhập để tiếp tục.",
                CreatedAt = createdUser.CreatedAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var identifier = request.Email.Trim().ToLower();

            // 1. Tìm user theo Email HOẶC UserName kèm Role và Organization
            var user = await _userRepository.FirstOrDefaultAsync(
                u => u.Email.ToLower() == identifier || (u.UserName != null && u.UserName.ToLower() == identifier), 
                nameof(User.Role), 
                nameof(User.Organization));

            if (user == null)
            {
                throw new BadRequestException("Tài khoản hoặc mật khẩu không chính xác.");
            }

            // 2. Xác thực mật khẩu
            if (!_cryptoService.VerifyPassword(request.Password, user.Password))
            {
                throw new BadRequestException("Tài khoản hoặc mật khẩu không chính xác.");
            }

            // 3. Kiểm tra trạng thái tài khoản
            if (user.Status != UserStatusEnum.Active)
            {
                throw new BadRequestException("Tài khoản đang bị khóa hoặc chưa được kích hoạt.");
            }

            // 4. Cập nhật LastLogin và Refresh Token mới
            var refreshToken = _cryptoService.GenerateRandomToken(32);
            user.LastLogin = DateTime.UtcNow;
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP);
            await _userRepository.UpdateAsync(user);

            // 5. Sinh SessionId và JWT Access Token
            var sessionId = Guid.NewGuid();
            var roleName = user.Role?.RoleName ?? "Student";
            var accessToken = _jwtService.GenerateToken(
                user.Id,
                roleName,
                sessionId,
                user.Email,
                user.Status,
                JwtConst.ACCESS_TOKEN_EXP
            );

            // 6. Lưu phiên vào Redis
            try
            {
                await _cacheService.Set($"ss:{user.Id}:{sessionId}", true, TimeSpan.FromSeconds(JwtConst.ACCESS_TOKEN_EXP));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Không thể lưu session vào Redis khi đăng nhập: {Message}", ex.Message);
            }

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                TokenType = "Bearer",
                ExpiresIn = JwtConst.ACCESS_TOKEN_EXP,
                User = MapToUserProfile(user, roleName)
            };
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(GoogleAuthRequestDto request)
        {
            // 1. Xác thực Google ID Token
            var googleUser = await _googleAuthService.ValidateTokenAsync(request.IdToken);
            var normalizedEmail = googleUser.Email.Trim().ToLower();

            // 2. Kiểm tra xem user đã tồn tại chưa
            var user = await _userRepository.FirstOrDefaultAsync(
                u => u.Email.ToLower() == normalizedEmail,
                nameof(User.Role),
                nameof(User.Organization));

            if (user == null)
            {
                // Ngăn chặn tạo Admin qua Google
                if (request.Role == UserRoleEnum.Admin)
                {
                    throw new BadRequestException("Không thể tự gán vai trò Admin khi đăng nhập Google.");
                }

                // Tìm Role Student (mặc định cho Google Auth)
                var roleName = request.Role == UserRoleEnum.Organization ? "Organization" : "Student";
                var roleEntity = await _roleRepository.FirstOrDefaultAsync(r => r.RoleName.ToLower() == roleName.ToLower());
                if (roleEntity == null)
                {
                    roleEntity = await _roleRepository.CreateAsync(new Role
                    {
                        RoleName = roleName,
                        Description = $"Role {roleName}",
                        Status = RoleStatusEnum.Active
                    });
                }

                var userId = Guid.NewGuid();
                var refreshToken = _cryptoService.GenerateRandomToken(32);

                user = new User
                {
                    Id = userId,
                    Name = googleUser.Name,
                    UserName = normalizedEmail.Split('@')[0],
                    Email = normalizedEmail,
                    Password = _cryptoService.HashPassword(Guid.NewGuid().ToString("N")),
                    RoleId = roleEntity.Id,
                    Role = roleEntity,
                    Status = UserStatusEnum.Active,
                    AuthType = "Google",
                    Avatar = googleUser.Picture,
                    Timezone = "Asia/Ho_Chi_Minh",
                    TotalXp = 0,
                    LastLogin = DateTime.UtcNow,
                    RefreshToken = refreshToken,
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP)
                };

                user = await _userRepository.CreateAsync(user);

                // Khởi tạo Profile & Stats
                await _profileRepository.CreateAsync(new UserProfile
                {
                    UserId = user.Id,
                    FullName = user.Name,
                    AvatarUrl = user.Avatar,
                    DailyGoalMinutes = 10
                });

                await _statsRepository.CreateAsync(new UserStats
                {
                    UserId = user.Id,
                    Hearts = 5,
                    HeartsUpdatedAt = DateTime.UtcNow,
                    Streak = 0,
                    StreakFreezeCount = 0,
                    IsPro = false
                });
            }
            else
            {
                if (user.Status != UserStatusEnum.Active)
                {
                    throw new BadRequestException("Tài khoản đang bị khóa hoặc chưa được kích hoạt.");
                }

                user.LastLogin = DateTime.UtcNow;
                if (!string.IsNullOrEmpty(googleUser.Picture) && string.IsNullOrEmpty(user.Avatar))
                {
                    user.Avatar = googleUser.Picture;
                }

                var refreshToken = _cryptoService.GenerateRandomToken(32);
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP);
                await _userRepository.UpdateAsync(user);
            }

            // Sinh Token
            var sessionId = Guid.NewGuid();
            var userRole = user.Role?.RoleName ?? "Student";
            var accessToken = _jwtService.GenerateToken(
                user.Id,
                userRole,
                sessionId,
                user.Email,
                user.Status,
                JwtConst.ACCESS_TOKEN_EXP
            );

            // Lưu Redis Session
            try
            {
                await _cacheService.Set($"ss:{user.Id}:{sessionId}", true, TimeSpan.FromSeconds(JwtConst.ACCESS_TOKEN_EXP));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Không thể lưu session vào Redis khi Google Login: {Message}", ex.Message);
            }

            return new AuthResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = user.RefreshToken!,
                TokenType = "Bearer",
                ExpiresIn = JwtConst.ACCESS_TOKEN_EXP,
                User = MapToUserProfile(user, userRole)
            };
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
            {
                throw new BadRequestException("Refresh token không hợp lệ.");
            }

            var user = await _userRepository.FirstOrDefaultAsync(
                u => u.RefreshToken == request.RefreshToken,
                nameof(User.Role),
                nameof(User.Organization));

            if (user == null || user.RefreshTokenExpiryTime == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                throw new UnauthorizedException("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
            }

            // Xoay vòng Refresh Token (Token Rotation)
            var newRefreshToken = _cryptoService.GenerateRandomToken(32);
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP);
            await _userRepository.UpdateAsync(user);

            var sessionId = Guid.NewGuid();
            var roleName = user.Role?.RoleName ?? "Student";
            var newAccessToken = _jwtService.GenerateToken(
                user.Id,
                roleName,
                sessionId,
                user.Email,
                user.Status,
                JwtConst.ACCESS_TOKEN_EXP
            );

            try
            {
                await _cacheService.Set($"ss:{user.Id}:{sessionId}", true, TimeSpan.FromSeconds(JwtConst.ACCESS_TOKEN_EXP));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Không thể lưu session vào Redis khi refresh token: {Message}", ex.Message);
            }

            return new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                TokenType = "Bearer",
                ExpiresIn = JwtConst.ACCESS_TOKEN_EXP,
                User = MapToUserProfile(user, roleName)
            };
        }

        public async Task<bool> LogoutAsync(Guid userId, Guid sessionId)
        {
            // 1. Xóa session trong Redis
            try
            {
                await _cacheService.Remove($"ss:{userId}:{sessionId}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Lỗi khi xóa session khỏi Redis: {Message}", ex.Message);
            }

            // 2. Thu hồi Refresh Token trong CSDL
            var user = await _userRepository.FindByIdAsync(userId);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userRepository.UpdateAsync(user);
            }

            return true;
        }

        public async Task<bool> ForceLogoutAsync(Guid userId)
        {
            // 1. Force logout tất cả session trong Redis
            try
            {
                await _cacheService.ForceLogout(userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Lỗi khi ForceLogout trên Redis: {Message}", ex.Message);
            }

            // 2. Hủy toàn bộ refresh token
            var user = await _userRepository.FindByIdAsync(userId);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await _userRepository.UpdateAsync(user);
            }

            return true;
        }

        public async Task<string> ForgotPasswordAsync(ForgotPasswordRequestDto request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();

            // 1. Kiểm tra cấu hình dịch vụ gửi mail (SMTP) - nếu thiếu trả HTTP 503
            if (!_mailService.IsConfigured())
            {
                throw new ServiceUnavailableException("Dịch vụ gửi email chưa được cấu hình trên hệ thống. Vui lòng liên hệ quản trị viên.");
            }

            // 2. Rate limit: Cooldown 60s
            var cooldownKey = $"pwd_reset_cooldown:{normalizedEmail}";
            if (await _cacheService.Exists(cooldownKey))
            {
                throw new BadRequestException("Vui lòng đợi 60 giây trước khi yêu cầu lại mã đặt lại mật khẩu.");
            }

            // 3. Rate limit: Tối đa 5 lần mỗi giờ
            var hourlyKey = $"pwd_reset_hourly_count:{normalizedEmail}";
            var hourlyCount = await _cacheService.Get<int?>(hourlyKey) ?? 0;
            if (hourlyCount >= 5)
            {
                throw new BadRequestException("Bạn đã vượt quá giới hạn gửi yêu cầu đặt lại mật khẩu (tối đa 5 lần/giờ). Vui lòng thử lại sau.");
            }

            // Đặt cooldown 60s và tăng hourly count
            await _cacheService.Set(cooldownKey, true, TimeSpan.FromSeconds(60));
            await _cacheService.Set(hourlyKey, hourlyCount + 1, TimeSpan.FromHours(1));

            var user = await _userRepository.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);

            // Luôn trả về cùng một thông điệp để tránh lộ thông tin email nào tồn tại
            const string genericMessage = "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.";
            if (user == null)
            {
                return genericMessage;
            }

            // 4. Sinh reset token và lưu độc lập vào Cache (Redis) với TTL 1 giờ, KHÔNG ghi đè RefreshToken
            var resetToken = _cryptoService.GenerateRandomToken(32);
            await _cacheService.Set($"pwd_reset_token:{resetToken}", user.Id, TimeSpan.FromHours(1));

            try
            {
                var subject = "[MIMO] Hướng dẫn đặt lại mật khẩu";
                var body = $"Mã đặt lại mật khẩu của bạn là: <b>{resetToken}</b><br/>Mã có hiệu lực trong 1 giờ.<br/>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.";
                await _mailService.SendEmailAsync(user.Email, subject, body);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi gửi email đặt lại mật khẩu cho {Email}: {Message}", user.Email, ex.Message);
                throw new ServiceUnavailableException("Không thể gửi email lúc này. Vui lòng thử lại sau.");
            }

            return genericMessage;
        }

        public async Task<string> ResetPasswordAsync(ResetPasswordRequestDto request)
        {
            var token = (request.Token ?? string.Empty).Trim();
            if (string.IsNullOrEmpty(token))
            {
                throw new BadRequestException("Mã đặt lại mật khẩu không được để trống.");
            }

            // Lấy UserId từ Redis Cache
            var tokenKey = $"pwd_reset_token:{token}";
            var userId = await _cacheService.Get<Guid?>(tokenKey);
            if (!userId.HasValue || userId.Value == Guid.Empty)
            {
                throw new BadRequestException("Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
            }

            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId.Value);
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy người dùng.");
            }

            user.Password = _cryptoService.HashPassword(request.NewPassword);
            await _userRepository.UpdateAsync(user);

            // Vô hiệu hóa token ngay sau khi dùng xong
            await _cacheService.Remove(tokenKey);

            // Thu hồi phiên đăng nhập cũ để buộc người dùng đăng nhập lại an toàn
            await _cacheService.ForceLogout(user.Id);

            return "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.";
        }

        private static UserProfileDto MapToUserProfile(User user, string? roleName = null)        {
            return new UserProfileDto
            {
                Id = user.Id,
                FullName = user.Name,
                Email = user.Email,
                RoleId = user.RoleId,
                RoleName = roleName ?? user.Role?.RoleName ?? "Student",
                Status = user.Status,
                PhoneNumber = user.Phone,
                AvatarUrl = user.Avatar,
                OrganizationId = user.OrganizationId,
                OrganizationName = user.Organization?.Name,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
