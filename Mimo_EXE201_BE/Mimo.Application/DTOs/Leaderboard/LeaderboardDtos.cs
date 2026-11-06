using System;
using System.Collections.Generic;

namespace Mimo.Application.DTOs.Leaderboard
{
    /// <summary>
    /// DTO thông tin một người dùng trên Bảng xếp hạng tuần
    /// </summary>
    public class LeaderboardEntryDto
    {
        public int Rank { get; set; }
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? AvatarUrl { get; set; }
        public int WeeklyXp { get; set; }
        public int Level { get; set; }
        public string LevelTitle { get; set; } = string.Empty;
        public bool IsCurrentUser { get; set; }
        /// <summary>Thành viên Mimo Pro đang còn hạn (hiển thị vương miện).</summary>
        public bool IsPro { get; set; }
    }

    /// <summary>
    /// DTO phản hồi cho API GET /api/v1/leaderboard/current (Task BE5-1)
    /// </summary>
    public class LeaderboardResponseDto
    {
        public string WeekNumber { get; set; } = string.Empty; // Format: YYYY-WW (vd: 2026-W43)
        public DateTime WeekStartDate { get; set; } // 00:00:00 Thứ Hai (UTC)
        public DateTime WeekEndDate { get; set; }   // 23:59:59 Chủ Nhật (UTC)
        public int RemainingSeconds { get; set; }  // Số giây đếm ngược tới hạn chốt tuần
        public string Tier { get; set; } = "Bronze"; // Hạng đấu Phase 1: Bronze (Tân binh)
        public List<LeaderboardEntryDto> TopEntries { get; set; } = new(); // Top 30 người dẫn đầu
        public LeaderboardEntryDto? CurrentUserEntry { get; set; } // Thứ hạng và điểm của người dùng hiện tại
    }
}
