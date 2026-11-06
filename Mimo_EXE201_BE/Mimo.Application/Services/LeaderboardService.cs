using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Mimo.Application.DTOs.Leaderboard;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Helper;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Application.Services
{
    public class LeaderboardService : ILeaderboardService
    {
        private readonly ILeaderboardRepository _leaderboardRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<UserProfile> _profileRepository;
        private readonly IGenericRepository<UserStats> _statsRepository;
        private readonly IGenericRepository<XpEvent> _xpEventRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly ICryptoService _cryptoService;
        private readonly ILogger<LeaderboardService> _logger;

        public static readonly Guid StudentRoleId = Guid.Parse("22222222-2222-2222-2222-222222222222");

        public LeaderboardService(
            ILeaderboardRepository leaderboardRepository,
            IGenericRepository<User> userRepository,
            IGenericRepository<UserProfile> profileRepository,
            IGenericRepository<UserStats> statsRepository,
            IGenericRepository<XpEvent> xpEventRepository,
            IGenericRepository<Role> roleRepository,
            ICryptoService cryptoService,
            ILogger<LeaderboardService> logger)
        {
            _leaderboardRepository = leaderboardRepository;
            _userRepository = userRepository;
            _profileRepository = profileRepository;
            _statsRepository = statsRepository;
            _xpEventRepository = xpEventRepository;
            _roleRepository = roleRepository;
            _cryptoService = cryptoService;
            _logger = logger;
        }

        public async Task<LeaderboardResponseDto> GetCurrentLeaderboardAsync(Guid? currentUserId = null, CancellationToken cancellationToken = default)
        {
            var vnTz = TimezoneHelper.GetVietnamTimeZone();
            var nowUtc = DateTime.UtcNow;
            var nowVn = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, vnTz);

            // Tính toán mốc 00:00:00 Thứ Hai và 23:59:59 Chủ Nhật tuần này theo giờ Việt Nam
            int daysFromMonday = ((int)nowVn.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
            var mondayVn = nowVn.Date.AddDays(-daysFromMonday);
            var nextMondayVn = mondayVn.AddDays(7);
            var weekEndVn = nextMondayVn.AddTicks(-1);

            var mondayUtc = TimeZoneInfo.ConvertTimeToUtc(mondayVn, vnTz);
            var weekEndUtc = TimeZoneInfo.ConvertTimeToUtc(weekEndVn, vnTz);

            // Định dạng chuỗi tuần YYYY-WW (vd: 2026-W43)
            int isoWeek = ISOWeek.GetWeekOfYear(mondayVn);
            string weekNumberStr = $"{mondayVn.Year}-W{isoWeek:D2}";

            int remainingSeconds = Math.Max(0, (int)(weekEndUtc - nowUtc).TotalSeconds);

            // Truy vấn Top 30 qua SQL tối ưu
            var rawTop = await _leaderboardRepository.GetWeeklyLeaderboardAsync(mondayUtc, weekEndUtc, top: 30, cancellationToken);

            var topEntries = new List<LeaderboardEntryDto>();
            int rankCounter = 1;

            foreach (var rec in rawTop)
            {
                var levelInfo = LevelHelper.GetLevelInfo(rec.TotalXp);
                bool isMe = currentUserId.HasValue && rec.UserId == currentUserId.Value;

                topEntries.Add(new LeaderboardEntryDto
                {
                    Rank = rankCounter++,
                    UserId = rec.UserId,
                    FullName = rec.FullName,
                    AvatarUrl = rec.AvatarUrl,
                    WeeklyXp = rec.WeeklyXp,
                    Level = levelInfo.Level,
                    LevelTitle = levelInfo.Title,
                    IsCurrentUser = isMe,
                    IsPro = rec.IsPro
                });
            }

            // Xác định thứ hạng và thông tin của người dùng hiện tại
            LeaderboardEntryDto? currentUserEntry = null;

            if (currentUserId.HasValue && currentUserId.Value != Guid.Empty)
            {
                currentUserEntry = topEntries.FirstOrDefault(e => e.IsCurrentUser);

                if (currentUserEntry == null)
                {
                    // Người dùng không nằm trong Top 30 -> tính toán thứ hạng riêng biệt
                    var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == currentUserId.Value, nameof(User.Profile), nameof(User.Stats));
                    if (user != null)
                    {
                        int myWeeklyXp = await _leaderboardRepository.GetUserWeeklyXpAsync(user.Id, mondayUtc, weekEndUtc, cancellationToken);
                        int myRank = await _leaderboardRepository.GetUserRankAsync(user.Id, myWeeklyXp, mondayUtc, weekEndUtc, cancellationToken);
                        var myLevel = LevelHelper.GetLevelInfo(user.TotalXp);

                        currentUserEntry = new LeaderboardEntryDto
                        {
                            Rank = myRank,
                            UserId = user.Id,
                            FullName = user.Profile?.FullName ?? user.Name,
                            AvatarUrl = user.Profile?.AvatarUrl ?? user.Avatar,
                            WeeklyXp = myWeeklyXp,
                            Level = myLevel.Level,
                            LevelTitle = myLevel.Title,
                            IsCurrentUser = true,
                            IsPro = user.Stats != null && user.Stats.IsPro && (user.Stats.ProExpiresAt == null || user.Stats.ProExpiresAt > DateTime.UtcNow)
                        };
                    }
                }
            }

            return new LeaderboardResponseDto
            {
                WeekNumber = weekNumberStr,
                WeekStartDate = mondayUtc,
                WeekEndDate = weekEndUtc,
                RemainingSeconds = remainingSeconds,
                Tier = "Bronze",
                TopEntries = topEntries,
                CurrentUserEntry = currentUserEntry
            };
        }

        public async Task<int> SeedMockLeaderboardUsersAsync(int count = 35, CancellationToken cancellationToken = default)
        {
            var vnTz = TimezoneHelper.GetVietnamTimeZone();
            var nowUtc = DateTime.UtcNow;
            var nowVn = TimeZoneInfo.ConvertTimeFromUtc(nowUtc, vnTz);

            int daysFromMonday = ((int)nowVn.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
            var mondayVn = nowVn.Date.AddDays(-daysFromMonday);
            var mondayUtc = TimeZoneInfo.ConvertTimeToUtc(mondayVn, vnTz);

            // Danh sách họ tên học sinh Việt Nam thực tế
            var mockNames = new[]
            {
                "Nguyễn Hoàng Nam", "Trần Mai Anh", "Lê Minh Khôi", "Phạm Thu Trang",
                "Võ Đức Thắng", "Đỗ Hải Yến", "Bùi Quốc Anh", "Hoàng Thảo Vy",
                "Dương Gia Bảo", "Ngô Khánh Linh", "Đặng Tuấn Kiệt", "Lý Phương Thảo",
                "Vũ Nhật Minh", "Phan Bảo Ngọc", "Trịnh Quốc Huy", "Hồ Minh Châu",
                "Lương Thanh Hằng", "Tạ Đình Phong", "Trương Kiều Oanh", "Cao Xuân Bách",
                "Đinh Hoài Nam", "Chu Yến Nhi", "Lâm Chấn Huy", "Đoàn Ngọc Ánh",
                "Lưu Đức Anh", "Mai Thùy Dung", "Bạch Công Minh", "Thái Hà My",
                "Hà Văn Thịnh", "Nghiêm Kim Ngân", "Phùng Trọng Nhân", "Quách Mỹ Duyên",
                "Tô Anh Dũng", "Diệp Bảo Trâm", "Ân Quốc Hưng", "Giang Hồng Nhung",
                "Châu Gia Khiêm", "Triệu Thảo Nguyên", "Khương Đình Trọng", "La Thúy Quỳnh"
            };

            var mockAvatars = new[]
            {
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
            };

            var studentRole = await _roleRepository.FirstOrDefaultAsync(r => r.Id == StudentRoleId);
            int seededCount = 0;
            var random = new Random(42); // Seed cố định để dữ liệu demo có tính nhất quán

            int usersToCreate = Math.Min(count, mockNames.Length);

            for (int i = 0; i < usersToCreate; i++)
            {
                string email = $"student{i + 1:D2}@mock.mimo.app";
                var existingUser = await _userRepository.FirstOrDefaultAsync(u => u.Email == email);

                if (existingUser != null)
                {
                    continue;
                }

                var userId = Guid.NewGuid();
                string fullName = mockNames[i];
                string avatarUrl = mockAvatars[i % mockAvatars.Length];

                // Sinh điểm XP ngẫu nhiên từ 60 XP đến 750 XP để tạo phân cấp đua top rõ rệt
                int totalUserXp = 0;
                int eventCount = random.Next(3, 8);
                var xpEvents = new List<XpEvent>();

                var totalSpan = (nowUtc - mondayUtc).TotalSeconds;
                if (totalSpan <= 0) totalSpan = 3600;

                for (int e = 0; e < eventCount; e++)
                {
                    int xpAmount = random.Next(1, 6) switch
                    {
                        1 => 10,
                        2 => 12, // 10 + combo 2
                        3 => 15, // 10 + perfect 5
                        4 => 20,
                        _ => 10
                    };

                    totalUserXp += xpAmount;

                    // Phân bổ thời gian trong tuần
                    double randomSeconds = random.NextDouble() * totalSpan;
                    var eventTime = mondayUtc.AddSeconds(randomSeconds);

                    xpEvents.Add(new XpEvent
                    {
                        UserId = userId,
                        Amount = xpAmount,
                        Source = (e % 2 == 0) ? "lesson_correct" : "combo_bonus",
                        ReferenceId = null,
                        CreatedAt = eventTime
                    });
                }

                var user = new User
                {
                    Id = userId,
                    Name = fullName,
                    UserName = $"student_{i + 1:D2}",
                    Email = email,
                    Password = _cryptoService.HashPassword("Mimo@123"),
                    RoleId = StudentRoleId,
                    Role = studentRole!,
                    Status = UserStatusEnum.Active,
                    AuthType = "Local",
                    Timezone = "Asia/Ho_Chi_Minh",
                    TotalXp = totalUserXp,
                    Avatar = avatarUrl,
                    CreatedAt = mondayUtc.AddMinutes(i * 10),
                    UpdatedAt = nowUtc
                };

                await _userRepository.CreateAsync(user);

                await _profileRepository.CreateAsync(new UserProfile
                {
                    UserId = userId,
                    FullName = fullName,
                    AvatarUrl = avatarUrl,
                    DailyGoalMinutes = 10
                });

                await _statsRepository.CreateAsync(new UserStats
                {
                    UserId = userId,
                    Hearts = 5,
                    HeartsUpdatedAt = nowUtc,
                    Streak = random.Next(1, 14),
                    StreakFreezeCount = random.Next(0, 3),
                    LastActiveDate = DateOnly.FromDateTime(nowVn)
                });

                await _xpEventRepository.CreateRangeAsync(xpEvents);
                seededCount++;
            }

            _logger.LogInformation("Đã khởi tạo thành công {Count} người dùng giả lập cho Bảng xếp hạng tuần.", seededCount);
            return seededCount;
        }
    }
}
