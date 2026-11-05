using System;
using System.Collections.Generic;

namespace Mimo.Application.DTOs.Business
{
    public class BusinessOverviewDto
    {
        public string OrganizationName { get; set; } = string.Empty;
        public string OrganizationCode { get; set; } = string.Empty;
        public int SeatCount { get; set; }
        public int UsedSeats { get; set; }
        public int ClassesCount { get; set; }
        public int StudentsCount { get; set; }
        public double ComplianceRate { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string SubscriptionTier { get; set; } = "Free";
        public List<WeakDomainDto> TopWeakDomains { get; set; } = new();
    }

    public class WeakDomainDto
    {
        public Guid DomainId { get; set; }
        public string DomainName { get; set; } = string.Empty;
        public double ErrorRate { get; set; }
        public string AlertLevel { get; set; } = "High";
    }

    public class ClassDto
    {
        public Guid Id { get; set; }
        public Guid OrganizationId { get; set; }
        public Guid? EducatorId { get; set; }
        public string? EducatorName { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ClassCode { get; set; } = string.Empty;
        public string? Grade { get; set; }
        public string? Room { get; set; }
        public string? FocusTopic { get; set; }
        public int MaxStudents { get; set; }
        public int StudentsCount { get; set; }
        public int CompletedStudents { get; set; }
        public double ComplianceRate { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class CreateClassRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Grade { get; set; }
        public string? Room { get; set; }
        public string? FocusTopic { get; set; }
        public int? MaxStudents { get; set; }
        public Guid? EducatorId { get; set; }

        // Alias tương thích frontend cũ: code do FE gửi (BE tự sinh mã nên chỉ ghi nhận), targetCount/studentsCount map sang MaxStudents
        public string? Code { get; set; }
        public int? TargetCount { get; set; }
        public int? StudentsCount { get; set; }
    }

    public class UpdateClassRequestDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Grade { get; set; }
        public string? Room { get; set; }
        public string? FocusTopic { get; set; }
        public int MaxStudents { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class AssignTeacherRequestDto
    {
        public Guid? EducatorId { get; set; }
        public string? TeacherId { get; set; }
        public string? TeacherName { get; set; }
    }

    public class TeacherLicenseDto
    {
        public Guid Id { get; set; }
        public string ActivationCode { get; set; } = string.Empty;
        public string? Note { get; set; }
        public List<Guid> AssignedClassIds { get; set; } = new();
        public List<string> AssignedClassNames { get; set; } = new();
        public Guid? ClaimedByEducatorId { get; set; }
        public string? ClaimedByEducatorName { get; set; }
        public bool IsClaimed { get; set; }
        public DateTime ExpiresAt { get; set; }
    }

    public class CreateTeacherLicenseRequestDto
    {
        public string? Note { get; set; }
        public List<Guid> AssignedClassIds { get; set; } = new();
        public List<string>? AssignedClassCodes { get; set; }
        public int ExpiresInDays { get; set; } = 365;
    }

    public class ClaimLicenseRequestDto
    {
        public string? ActivationCode { get; set; }
        public string? LicenseKey { get; set; }
    }

    public class ClaimLicenseResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public List<string> AssignedClasses { get; set; } = new();
    }

    public class AssignmentDto
    {
        public Guid Id { get; set; }
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public bool IsSample { get; set; } = false;
        public Guid NodeId { get; set; }
        public string NodeTitle { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Deadline { get; set; }
        public int PassScoreThreshold { get; set; }
        public int RewardXp { get; set; }
        public int TotalEnrolled { get; set; }
        public int CompletedCount { get; set; }
        public double ComplianceRate { get; set; }
        public bool IsOverdue { get; set; }
    }

    public class CreateAssignmentRequestDto
    {
        public List<Guid> ClassIds { get; set; } = new();
        public Guid NodeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Deadline { get; set; }
        public int PassScoreThreshold { get; set; } = 80;
        public int RewardXp { get; set; } = 50;
    }

    public class ClassHeatmapDto
    {
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public bool IsSample { get; set; } = false;
        public List<QuestionHeatmapItemDto> Questions { get; set; } = new();
    }

    public class QuestionHeatmapItemDto
    {
        public Guid QuestionId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int TotalAttempts { get; set; }
        public int WrongAttempts { get; set; }
        public double WrongRate { get; set; }
        public bool IsRedFlag { get; set; }
        public string PedagogicalTip { get; set; } = string.Empty;
    }

    public class ClassProgressDto
    {
        public Guid ClassId { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public bool IsSample { get; set; } = false;
        public List<StudentProgressItemDto> Students { get; set; } = new();
    }

    public class StudentProgressItemDto
    {
        public Guid StudentId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int BestScore { get; set; }
        public bool IsPassed { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string Status { get; set; } = "Chưa làm bài";
    }

    public class SkillGapReportDto
    {
        public bool IsSample { get; set; } = false;
        public List<DomainSkillGapDto> Domains { get; set; } = new();
    }

    public class DomainSkillGapDto
    {
        public Guid DomainId { get; set; }
        public string DomainName { get; set; } = string.Empty;
        public int TotalQuestionsAnswered { get; set; }
        public int TotalWrong { get; set; }
        public double WrongRate { get; set; }
        public string Severity { get; set; } = "Low";
    }

    public class StudentClassroomDto
    {
        public bool Joined { get; set; }
        public StudentClassInfoDto? ClassInfo { get; set; }
        public List<StudentAssignmentItemDto> Assignments { get; set; } = new();
    }

    public class StudentClassInfoDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public bool IsSample { get; set; } = false;
        public string School { get; set; } = string.Empty;
        public string? Topic { get; set; }
        public string? Teacher { get; set; }
        public string? TeacherRole { get; set; }
        public int TotalStudents { get; set; }
    }

    public class StudentAssignmentItemDto
    {
        public Guid AssignmentId { get; set; }
        public Guid NodeId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime Deadline { get; set; }
        public int PassScoreThreshold { get; set; }
        public int RewardXp { get; set; }
        public int BestScore { get; set; }
        public bool IsPassed { get; set; }
        public string Status { get; set; } = "Chưa làm"; // Chưa làm | Đạt | Chưa đạt | Quá hạn
    }

    public class JoinClassRequestDto
    {
        public string ClassCode { get; set; } = string.Empty;
        public string? Code
        {
            get => ClassCode;
            set { if (!string.IsNullOrWhiteSpace(value)) ClassCode = value; }
        }
    }

    public class LeaveClassRequestDto
    {
        public Guid? ClassId { get; set; }
    }
}