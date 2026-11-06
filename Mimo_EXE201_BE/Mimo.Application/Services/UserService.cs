using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Mimo.Application.DTOs.Gamification;
using Mimo.Application.DTOs.User;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Exceptions;
using Mimo.DomainLayer.Helper;

namespace Mimo.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<UserProfile> _profileRepository;
        private readonly IGenericRepository<UserStats> _statsRepository;
        private readonly IGenericRepository<Transaction> _transactionRepository;
        private readonly IGenericRepository<LessonSession> _sessionRepository;
        private readonly IGenericRepository<XpEvent> _xpEventRepository;
        private readonly IGenericRepository<UserNodeProgress> _progressRepository;
        private readonly IGenericRepository<Domain> _domainRepository;
        private readonly IGenericRepository<Node> _nodeRepository;
        private readonly IGenericRepository<UserBadge> _userBadgeRepository;
        private readonly IGenericRepository<Badge> _badgeRepository;
        private readonly ICryptoService _cryptoService;
        private readonly ICacheService _cacheService;
        private readonly ILogger<UserService> _logger;

        public UserService(
            IGenericRepository<User> userRepository,
            IGenericRepository<UserProfile> profileRepository,
            IGenericRepository<UserStats> statsRepository,
            IGenericRepository<Transaction> transactionRepository,
            IGenericRepository<LessonSession> sessionRepository,
            IGenericRepository<XpEvent> xpEventRepository,
            IGenericRepository<UserNodeProgress> progressRepository,
            IGenericRepository<Domain> domainRepository,
            IGenericRepository<Node> nodeRepository,
            IGenericRepository<UserBadge> userBadgeRepository,
            IGenericRepository<Badge> badgeRepository,
            ICryptoService cryptoService,
            ICacheService cacheService,
            ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _profileRepository = profileRepository;
            _statsRepository = statsRepository;
            _transactionRepository = transactionRepository;
            _sessionRepository = sessionRepository;
            _xpEventRepository = xpEventRepository;
            _progressRepository = progressRepository;
            _domainRepository = domainRepository;
            _nodeRepository = nodeRepository;
            _userBadgeRepository = userBadgeRepository;
            _badgeRepository = badgeRepository;
            _cryptoService = cryptoService;
            _cacheService = cacheService;
            _logger = logger;
        }

        public async Task<UserDetailDto> GetMeAsync(Guid userId)
        {
            var user = await _userRepository.FirstOrDefaultAsync(
                u => u.Id == userId,
                nameof(User.Role),
                nameof(User.Organization),
                nameof(User.Profile),
                nameof(User.Stats));

            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            // Đảm bảo UserStats luôn tồn tại (phòng trường hợp tài khoản cũ chưa có)
            if (user.Stats == null)
            {
                user.Stats = new UserStats
                {
                    UserId = user.Id,
                    Hearts = 5,
                    HeartsUpdatedAt = DateTime.UtcNow,
                    Streak = 0,
                    StreakFreezeCount = 0,
                    IsPro = false
                };
                await _statsRepository.CreateAsync(user.Stats);
            }

            // Đảm bảo UserProfile luôn tồn tại
            if (user.Profile == null)
            {
                user.Profile = new UserProfile
                {
                    UserId = user.Id,
                    FullName = user.Name,
                    AvatarUrl = user.Avatar,
                    DailyGoalMinutes = 10
                };
                await _profileRepository.CreateAsync(user.Profile);
            }

            // Áp dụng thuật toán Lazy Heart Regeneration theo AGENT.md Section 5.1
            var (currentHearts, nextHeartInSeconds, updated) = user.Stats.CalculateCurrentHearts(DateTime.UtcNow);
            if (updated)
            {
                await _statsRepository.UpdateAsync(user.Stats);
            }

            // Xác định gói cước active nếu user là Pro
            string planCode = "FREE";
            string planName = "Mimo Free";

            if (user.Stats.IsPro)
            {
                var transactions = await _transactionRepository.WhereAsync(
                    t => t.UserId == userId && !string.IsNullOrEmpty(t.PlanCode));
                
                var latestTransaction = transactions
                    .OrderByDescending(t => t.Status == DomainLayer.Enum.GeneralEnum.TransactionStatusEnum.Success)
                    .ThenByDescending(t => t.CompletedAt ?? t.TransactionDate)
                    .FirstOrDefault();

                if (latestTransaction != null && !string.IsNullOrEmpty(latestTransaction.PlanCode))
                {
                    var cleanCode = latestTransaction.PlanCode.Trim().ToUpperInvariant();
                    if (cleanCode.StartsWith("MIMO_")) cleanCode = cleanCode.Substring(5);

                    if (cleanCode == "PREMIUM_6M" || latestTransaction.Amount == 399000)
                    {
                        planCode = "PREMIUM_6M";
                        planName = "Gói 6 Tháng (Half-Year)";
                    }
                    else if (cleanCode == "PREMIUM_3M" || latestTransaction.Amount == 219000)
                    {
                        planCode = "PREMIUM_3M";
                        planName = "Gói 3 Tháng (Quarterly)";
                    }
                    else if (cleanCode == "PREMIUM_1M" || latestTransaction.Amount == 79000)
                    {
                        planCode = "PREMIUM_1M";
                        planName = "Gói 1 Tháng (Monthly)";
                    }
                    else
                    {
                        planCode = cleanCode;
                        planName = "Gói Mimo Pro Nâng Cấp";
                    }
                }
                else
                {
                    planCode = "PREMIUM_6M";
                    planName = "Gói Mimo Pro";
                }
            }

            // Tính toán Level theo AGENT.md Section 5.3
            var levelInfo = LevelHelper.GetLevelInfo(user.TotalXp);

            return new UserDetailDto
            {
                Id = user.Id,
                FullName = user.Profile?.FullName ?? user.Name,
                UserName = user.UserName,
                Email = user.Email,
                PhoneNumber = user.Phone,
                Address = user.Address,
                AvatarUrl = user.Profile?.AvatarUrl ?? user.Avatar,
                Status = user.Status,
                AuthType = user.AuthType ?? "Local",
                RoleId = user.RoleId,
                RoleName = user.Role?.RoleName ?? "Student",
                OrganizationId = user.OrganizationId,
                OrganizationName = user.Organization?.Name,
                Timezone = user.Timezone,

                // XP & Level
                TotalXp = user.TotalXp,
                Level = levelInfo.Level,
                LevelTitle = levelInfo.Title,
                XpToNextLevel = levelInfo.XpToNextLevel,
                LevelProgressPercent = levelInfo.ProgressPercent,

                // Hearts & Pro Plan
                Hearts = currentHearts,
                MaxHearts = 5,
                NextHeartInSeconds = nextHeartInSeconds,
                IsPro = user.Stats.IsPro,
                ProExpiresAt = user.Stats.ProExpiresAt,
                PlanCode = planCode,
                PlanName = planName,

                // Streak
                Streak = user.Stats.Streak,
                StreakFreezeCount = user.Stats.StreakFreezeCount,
                LastActiveDate = user.Stats.LastActiveDate,

                // Onboarding
                DailyGoalMinutes = user.Profile?.DailyGoalMinutes ?? 10,
                RiskSurveyResult = user.Profile?.RiskSurveyResult,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDetailDto> UpdateOnboardingAsync(Guid userId, UpdateOnboardingDto request)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId, nameof(User.Profile));
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            if (user.Profile == null)
            {
                user.Profile = new UserProfile
                {
                    UserId = user.Id,
                    FullName = user.Name,
                    DailyGoalMinutes = request.DailyGoalMinutes,
                    RiskSurveyResult = request.RiskSurveyResult
                };
                await _profileRepository.CreateAsync(user.Profile);
            }
            else
            {
                user.Profile.DailyGoalMinutes = request.DailyGoalMinutes;
                if (!string.IsNullOrWhiteSpace(request.RiskSurveyResult))
                {
                    user.Profile.RiskSurveyResult = request.RiskSurveyResult;
                }
                user.Profile.UpdatedAt = DateTime.UtcNow;
                await _profileRepository.UpdateAsync(user.Profile);
            }

            return await GetMeAsync(userId);
        }

        public async Task<UserDetailDto> UpdateProfileAsync(Guid userId, UpdateProfileDto request)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId, nameof(User.Profile));
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            user.Name = request.FullName.Trim();
            user.Phone = request.PhoneNumber;
            user.Address = request.Address;
            user.Avatar = request.AvatarUrl;
            if (!string.IsNullOrWhiteSpace(request.Timezone))
            {
                user.Timezone = request.Timezone.Trim();
            }
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);


            if (user.Profile != null)
            {
                user.Profile.FullName = user.Name;
                user.Profile.AvatarUrl = user.Avatar;
                user.Profile.UpdatedAt = DateTime.UtcNow;
                await _profileRepository.UpdateAsync(user.Profile);
            }

            return await GetMeAsync(userId);
        }

        public async Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto request)
        {
            var user = await _userRepository.FindByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            // 1. Xác thực mật khẩu cũ
            if (!_cryptoService.VerifyPassword(request.CurrentPassword, user.Password))
            {
                throw new BadRequestException("Mật khẩu hiện tại không chính xác.");
            }

            if (request.CurrentPassword == request.NewPassword)
            {
                throw new BadRequestException("Mật khẩu mới không được trùng với mật khẩu cũ.");
            }

            // 2. Băm và cập nhật mật khẩu mới
            user.Password = _cryptoService.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            // Xoay vòng Refresh Token
            user.RefreshToken = _cryptoService.GenerateRandomToken(32);
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddSeconds(JwtConst.REFRESH_TOKEN_EXP);
            await _userRepository.UpdateAsync(user);

            // 3. Đăng xuất khỏi toàn bộ các thiết bị/phiên cũ trong Redis
            try
            {
                await _cacheService.ForceLogout(userId);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Lỗi khi ForceLogout phiên cũ sau đổi mật khẩu: {Message}", ex.Message);
            }

            return true;
        }

        public async Task<UserDetailDto> UpdateAvatarAsync(Guid userId, string avatarUrl)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId, nameof(User.Profile));
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            user.Avatar = avatarUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            if (user.Profile != null)
            {
                user.Profile.AvatarUrl = avatarUrl;
                user.Profile.UpdatedAt = DateTime.UtcNow;
                await _profileRepository.UpdateAsync(user.Profile);
            }

            return await GetMeAsync(userId);
        }

        public async Task<StudyStatsResponseDto> GetStudyStatsAsync(Guid userId)
        {
            var user = await _userRepository.FindByIdAsync(userId);
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin người dùng.");
            }

            var stats = await _statsRepository.FirstOrDefaultAsync(s => s.UserId == userId);
            var allSessions = await _sessionRepository.WhereAsync(s => s.UserId == userId && s.Status == "completed");
            int totalMinutesLearned = (int)Math.Round(allSessions.Sum(s => s.CompletedAt.HasValue ? Math.Max(1.0, (s.CompletedAt.Value - s.StartedAt).TotalMinutes) : 2.0));
            if (totalMinutesLearned == 0 && allSessions.Any())
            {
                totalMinutesLearned = allSessions.Count * 2;
            }

            var completedProgress = await _progressRepository.WhereAsync(p => p.UserId == userId && p.Status == "done");
            int totalLessonsCompleted = completedProgress.Count;

            // 7-day Weekly Stats
            var vnNow = DateTime.UtcNow.AddHours(7);
            var weeklyStats = new List<DailyStudyStatDto>();

            for (int i = 6; i >= 0; i--)
            {
                var targetDate = DateOnly.FromDateTime(vnNow.AddDays(-i));
                var targetStartUtc = new DateTime(targetDate.Year, targetDate.Month, targetDate.Day, 0, 0, 0, DateTimeKind.Utc).AddHours(-7);
                var targetEndUtc = targetStartUtc.AddDays(1);

                var daySessions = allSessions.Where(s => s.CreatedAt >= targetStartUtc && s.CreatedAt < targetEndUtc).ToList();
                int dayMinutes = (int)Math.Round(daySessions.Sum(s => s.CompletedAt.HasValue ? Math.Max(1.0, (s.CompletedAt.Value - s.StartedAt).TotalMinutes) : 2.0));
                if (dayMinutes == 0 && daySessions.Any()) dayMinutes = daySessions.Count * 2;

                var dayXpEvents = await _xpEventRepository.WhereAsync(x => x.UserId == userId && x.Amount > 0 && x.CreatedAt >= targetStartUtc && x.CreatedAt < targetEndUtc);
                int dayXp = dayXpEvents.Sum(x => x.Amount);

                string dayName = targetDate.DayOfWeek switch
                {
                    DayOfWeek.Monday => "T2",
                    DayOfWeek.Tuesday => "T3",
                    DayOfWeek.Wednesday => "T4",
                    DayOfWeek.Thursday => "T5",
                    DayOfWeek.Friday => "T6",
                    DayOfWeek.Saturday => "T7",
                    DayOfWeek.Sunday => "CN",
                    _ => "T2"
                };

                weeklyStats.Add(new DailyStudyStatDto
                {
                    DayOfWeek = dayName,
                    Date = targetDate.ToString("yyyy-MM-dd"),
                    Minutes = dayMinutes,
                    Xp = dayXp
                });
            }

            // Domain Mastery (4 Domains)
            var domains = await _domainRepository.WhereAsync(d => d.Status == "Active");
            var allNodes = await _nodeRepository.ListAsync(nameof(Node.Unit));
            var completedNodeIds = completedProgress.Select(p => p.NodeId).ToHashSet();

            var skillRadar = new List<DomainMasteryDto>();
            foreach (var d in domains.OrderBy(d => d.Order))
            {
                var domainNodes = allNodes.Where(n => n.Unit != null && n.Unit.DomainId == d.Id).ToList();
                int totalNodesInDomain = domainNodes.Count;
                int completedInDomain = domainNodes.Count(n => completedNodeIds.Contains(n.Id));
                int masteryPercent = totalNodesInDomain > 0 ? (int)((double)completedInDomain / totalNodesInDomain * 100) : 0;

                skillRadar.Add(new DomainMasteryDto
                {
                    DomainId = d.Id,
                    DomainName = d.Name,
                    Slug = d.Slug,
                    TotalNodes = totalNodesInDomain,
                    CompletedNodes = completedInDomain,
                    MasteryPercent = masteryPercent
                });
            }

            // Recent Badges
            var userBadges = await _userBadgeRepository.WhereAsync(ub => ub.UserId == userId);
            var allBadges = await _badgeRepository.ListAsync();
            var recentBadges = new List<BadgeDto>();

            foreach (var ub in userBadges.OrderByDescending(ub => ub.UnlockedAt).Take(6))
            {
                var b = allBadges.FirstOrDefault(x => x.Id == ub.BadgeId);
                if (b != null)
                {
                    recentBadges.Add(new BadgeDto
                    {
                        Id = b.Id,
                        Title = b.Title,
                        Category = b.Category,
                        Description = b.Description,
                        Icon = b.Icon,
                        Rarity = b.Rarity,
                        CriteriaType = b.CriteriaType,
                        CriteriaValue = b.CriteriaValue,
                        ProgressPercent = 100,
                        IsUnlocked = true,
                        UnlockedAt = ub.UnlockedAt
                    });
                }
            }

            return new StudyStatsResponseDto
            {
                TotalMinutesLearned = totalMinutesLearned,
                TotalLessonsCompleted = totalLessonsCompleted,
                TotalXp = user.TotalXp,
                CurrentStreak = stats?.Streak ?? 0,
                WeeklyStats = weeklyStats,
                SkillRadar = skillRadar,
                RecentBadges = recentBadges
            };
        }
    }
}
