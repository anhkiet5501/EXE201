using System;
using System.Collections.Generic;

namespace Mimo.Application.DTOs.Pro
{
    /// <summary>Độ chính xác theo từng chủ đề trong báo cáo rủi ro Pro.</summary>
    public class DomainRiskDto
    {
        public Guid DomainId { get; set; }
        public string DomainName { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public int TotalAnswers { get; set; }
        public int WrongAnswers { get; set; }
        public int AccuracyPercent { get; set; }
    }

    public class WeakQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int TimesWrong { get; set; }
        public string DomainName { get; set; } = string.Empty;
    }

    public class DailyAccuracyDto
    {
        /// <summary>Ngày theo múi giờ Asia/Ho_Chi_Minh (yyyy-MM-dd).</summary>
        public string Date { get; set; } = string.Empty;
        public int Total { get; set; }
        public int Correct { get; set; }
    }

    /// <summary>Báo cáo rủi ro an toàn 30 ngày: chỉ dành cho thành viên Mimo Pro.</summary>
    public class ProRiskReportDto
    {
        public int PeriodDays { get; set; } = 30;
        public int TotalAnswers { get; set; }
        public int CorrectAnswers { get; set; }
        public int AccuracyPercent { get; set; }
        public List<DomainRiskDto> Domains { get; set; } = new();
        public List<WeakQuestionDto> WeakQuestions { get; set; } = new();
        public List<DailyAccuracyDto> Daily { get; set; } = new();
        public string? FocusDomainName { get; set; }
        public string FocusMessage { get; set; } = string.Empty;
        public DateTime? ProExpiresAt { get; set; }
        public int? DaysLeft { get; set; }
    }

    /// <summary>Câu hỏi để ôn tập chuyên sâu. KHÔNG chứa đáp án đúng (Zero Leakage).</summary>
    public class DeepReviewQuestionDto
    {
        public Guid QuestionId { get; set; }
        public string Type { get; set; } = "choice";
        public string Title { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public object? Payload { get; set; }
        public string Difficulty { get; set; } = "Medium";
        public int TimesWrong { get; set; }
        public DateTime? LastWrongAt { get; set; }
    }

    public class DeepReviewAnswerResponseDto
    {
        public Guid QuestionId { get; set; }
        public bool IsCorrect { get; set; }
        public string Explanation { get; set; } = string.Empty;
        public string? Source { get; set; }
        public string? ReviewedBy { get; set; }
    }
}
