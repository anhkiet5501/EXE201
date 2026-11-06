using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Entities;
using Mimo.Infrastructure.Database;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Infrastructure.Repository
{
    public class LeaderboardRepository : ILeaderboardRepository
    {
        private readonly MimoDbContext _context;

        public LeaderboardRepository(MimoDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserWeeklyXpRecord>> GetWeeklyLeaderboardAsync(
            DateTime startUtc, 
            DateTime endUtc, 
            int top = 30, 
            CancellationToken cancellationToken = default)
        {
            var nowUtc = DateTime.UtcNow;
            var query = from u in _context.Users.AsNoTracking()
                        where u.Status == UserStatusEnum.Active
                        let weeklyXp = _context.XpEvents
                            .Where(x => x.UserId == u.Id && x.CreatedAt >= startUtc && x.CreatedAt <= endUtc)
                            .Sum(x => (int?)x.Amount) ?? 0
                        where weeklyXp > 0
                        orderby weeklyXp descending, u.CreatedAt ascending
                        select new UserWeeklyXpRecord
                        {
                            UserId = u.Id,
                            FullName = u.Profile != null && !string.IsNullOrWhiteSpace(u.Profile.FullName) ? u.Profile.FullName : u.Name,
                            AvatarUrl = u.Profile != null && !string.IsNullOrWhiteSpace(u.Profile.AvatarUrl) ? u.Profile.AvatarUrl : u.Avatar,
                            TotalXp = u.TotalXp,
                            WeeklyXp = weeklyXp,
                            IsPro = u.Stats != null && u.Stats.IsPro && (u.Stats.ProExpiresAt == null || u.Stats.ProExpiresAt > nowUtc),
                            CreatedAt = u.CreatedAt ?? DateTime.UtcNow
                        };

            return await query.Take(top).ToListAsync(cancellationToken);
        }

        public async Task<int> GetUserWeeklyXpAsync(
            Guid userId, 
            DateTime startUtc, 
            DateTime endUtc, 
            CancellationToken cancellationToken = default)
        {
            return await _context.XpEvents
                .Where(x => x.UserId == userId && x.CreatedAt >= startUtc && x.CreatedAt <= endUtc)
                .SumAsync(x => (int?)x.Amount, cancellationToken) ?? 0;
        }

        public async Task<int> GetUserRankAsync(
            Guid userId, 
            int userWeeklyXp, 
            DateTime startUtc, 
            DateTime endUtc, 
            CancellationToken cancellationToken = default)
        {
            if (userWeeklyXp <= 0)
            {
                // Người dùng chưa có XP tuần này: rank sẽ đứng sau tất cả những người có XP
                var totalWithXp = await (from u in _context.Users.AsNoTracking()
                                         where u.Status == UserStatusEnum.Active
                                         let xp = _context.XpEvents
                                             .Where(x => x.UserId == u.Id && x.CreatedAt >= startUtc && x.CreatedAt <= endUtc)
                                             .Sum(x => (int?)x.Amount) ?? 0
                                         where xp > 0
                                         select u.Id).CountAsync(cancellationToken);
                return totalWithXp + 1;
            }

            var usersAbove = await (from u in _context.Users.AsNoTracking()
                                    where u.Status == UserStatusEnum.Active && u.Id != userId
                                    let xp = _context.XpEvents
                                        .Where(x => x.UserId == u.Id && x.CreatedAt >= startUtc && x.CreatedAt <= endUtc)
                                        .Sum(x => (int?)x.Amount) ?? 0
                                    where xp > userWeeklyXp
                                    select u.Id).CountAsync(cancellationToken);

            return usersAbove + 1;
        }
    }
}
