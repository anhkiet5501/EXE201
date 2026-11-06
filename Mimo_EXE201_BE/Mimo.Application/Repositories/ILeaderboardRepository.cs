using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Mimo.Application.Repositories
{
    public class UserWeeklyXpRecord
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int TotalXp { get; set; }
        public int WeeklyXp { get; set; }
        public bool IsPro { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public interface ILeaderboardRepository
    {
        /// <summary>
        /// Lấy Top N người có điểm Weekly XP cao nhất trong tuần
        /// </summary>
        Task<List<UserWeeklyXpRecord>> GetWeeklyLeaderboardAsync(
            DateTime startUtc, 
            DateTime endUtc, 
            int top = 30, 
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Lấy tổng điểm XP trong tuần của một người dùng cụ thể
        /// </summary>
        Task<int> GetUserWeeklyXpAsync(
            Guid userId, 
            DateTime startUtc, 
            DateTime endUtc, 
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Tính toán thứ hạng chính xác của người dùng dựa trên điểm Weekly XP
        /// </summary>
        Task<int> GetUserRankAsync(
            Guid userId, 
            int userWeeklyXp, 
            DateTime startUtc, 
            DateTime endUtc, 
            CancellationToken cancellationToken = default);
    }
}
