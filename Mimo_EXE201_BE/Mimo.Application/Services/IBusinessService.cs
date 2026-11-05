using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Mimo.Application.DTOs.Business;

namespace Mimo.Application.Services
{
    public interface IBusinessService
    {
        Task<BusinessOverviewDto> GetOverviewAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<List<ClassDto>> GetClassesAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<ClassDto> CreateClassAsync(Guid userId, CreateClassRequestDto request, CancellationToken cancellationToken = default);
        Task<ClassDto> UpdateClassAsync(Guid userId, Guid classId, UpdateClassRequestDto request, CancellationToken cancellationToken = default);
        Task DeleteClassAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default);
        Task<ClassDto> AssignTeacherAsync(Guid userId, Guid classId, AssignTeacherRequestDto request, CancellationToken cancellationToken = default);
        Task<List<TeacherLicenseDto>> GetTeacherKeysAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<TeacherLicenseDto> GenerateTeacherKeyAsync(Guid userId, CreateTeacherLicenseRequestDto request, CancellationToken cancellationToken = default);
        Task RevokeTeacherKeyAsync(Guid userId, Guid keyId, CancellationToken cancellationToken = default);
        Task<ClaimLicenseResponseDto> ClaimTeacherKeyAsync(Guid userId, ClaimLicenseRequestDto request, CancellationToken cancellationToken = default);
        Task<List<AssignmentDto>> GetCampaignsAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<List<AssignmentDto>> CreateCampaignAsync(Guid userId, CreateAssignmentRequestDto request, CancellationToken cancellationToken = default);
        Task<SkillGapReportDto> GetSkillGapReportAsync(Guid userId, CancellationToken cancellationToken = default);
        Task<ClassHeatmapDto> GetClassHeatmapAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default);
        Task<ClassProgressDto> GetClassProgressAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default);
        Task<List<ClassDto>> GetEducatorClassesAsync(Guid educatorId, CancellationToken cancellationToken = default);
    }
}
