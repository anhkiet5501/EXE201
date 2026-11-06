# NHẬT KÝ: NÂNG CẤP QUYỀN LỢI MIMO PRO

Ngày thực hiện: 2026-11-06. Phạm vi: phần gói Mimo Pro (BE .NET 8 + FE React).
Tài liệu tóm tắt ngắn hơn: `Mimo_EXE201_BE/MIMO_PRO_QUYEN_LOI.md`.

---

## 1. VẤN ĐỀ BAN ĐẦU
Sau khi lên gói Pro, người dùng không thấy khác gì gói Free. Đã đọc `AGENT.md`, `AGENTFE.md`, các file docs và rà code, tìm được 4 nguyên nhân:

| # | Nguyên nhân | Bằng chứng |
|---|---|---|
| 1 | **Thanh trên cùng hiện số liệu mẫu** cho mọi tài khoản (7 streak, 1.250 XP, 4/5 tim). `LearnerLayout` truyền `dashboardData.stats` (lấy từ `mockLearner.js`) vào header; số liệu thật từ `/auth/me` không bao giờ được dùng. | `LearnerLayout.jsx`, `mockLearner.js` |
| 2 | **Pro thực chất chỉ có "vô hạn tim"** và một huy hiệu nhỏ. Không có quyền lợi nào khác tồn tại trong code. | Rà toàn bộ BE/FE |
| 3 | **Trang giá quảng cáo quyền lợi không có thật**: trợ lý Bác sĩ/AI, mô phỏng 3D, chứng chỉ QR, kết nối phụ huynh, hỗ trợ 1:1, "3 lượt AI/ngày" của gói Free. | `UpgradePlanPage.jsx` |
| 4 | **Thống kê học tập luôn bằng 0**: `GetStudyStatsAsync` so sánh `"Completed"` trong khi dữ liệu lưu `"completed"` (phiên) và `"done"` (tiến độ node). | `UserService.cs` |

Ngoài ra Pro cũ không bao giờ hết hạn (đã xử lý ở đợt thanh toán SePay: `UserStats.ExpireProIfNeeded`).

## 2. QUYỀN LỢI PRO THEO SPEC
Spec (`Tai_Lieu_Dac_Ta_Du_An_MIMO_Gamified_LifeSkills.md`, `AGENT.md`) quy định Pro gồm: vô hạn tim, không quảng cáo, **mở khóa phòng luyện tập chuyên sâu các tình huống sai**, báo cáo rủi ro chi tiết; gói 3 và 6 tháng tặng bùa Streak Freeze.

| Quyền lợi | Trước | Sau |
|---|---|---|
| Vô hạn tim | Có (ít thấy) | Hiện ∞ ở thanh trên và màn học bài |
| Ôn tập chuyên sâu | Chưa có | **MỚI** (tab trong Phòng ôn tập) |
| Báo cáo rủi ro | Chưa có | **MỚI** (thẻ ở trang Hồ sơ) |
| Vương miện Pro | Chỉ ở Hồ sơ | Thanh trên, Hồ sơ, Bảng xếp hạng |
| Bùa Streak Freeze theo gói | Có (không hiển thị) | Hiển thị số bùa |
| Không quảng cáo | Không có quảng cáo | Giữ nguyên (ghi trên trang giá) |

## 3. BACKEND (.NET 8, Onion Architecture)

### 3.1. File mới
- `Mimo.Application/Services/IProService.cs`, `ProService.cs`: logic quyền lợi Pro.
- `Mimo.Application/DTOs/Pro/ProDtos.cs`: `ProRiskReportDto`, `DomainRiskDto`, `WeakQuestionDto`, `DailyAccuracyDto`, `DeepReviewQuestionDto`, `DeepReviewAnswerResponseDto`.
- `Mimo.API/Controllers/ProController.cs`: route `api/v1/pro/*`.

### 3.2. API mới (đăng nhập; chỉ Pro còn hạn, Free nhận 403)
| API | Mô tả |
|---|---|
| `GET /api/v1/pro/risk-report` | Độ chính xác 30 ngày theo chủ đề; top 5 câu sai nhiều nhất; xu hướng 7 ngày (múi giờ UTC+7); gợi ý chủ đề ưu tiên; số ngày Pro còn lại |
| `GET /api/v1/pro/deep-review` | Câu người dùng từng làm sai (mọi thời điểm, kể cả đã giải quyết), tối đa 50 câu, ưu tiên câu sai nhiều. **Không trả đáp án và giải thích.** |
| `POST /api/v1/pro/deep-review/answer` | Chấm ở server; trả đúng/sai + giải thích + nguồn + người thẩm định. **Không cộng XP, không trừ/hồi tim, không đổi trạng thái.** |

### 3.3. Quy tắc tuân thủ AGENT.md
- **Server là nguồn sự thật:** `RequireProAsync` kiểm tra `IsPro` ở server (gọi `ExpireProIfNeeded` trước), không tin cờ từ client.
- **Zero Leakage:** DTO câu hỏi không có `CorrectData`; giải thích chỉ trả sau khi nộp đáp án.
- **Chống dò đáp án:** `deep-review/answer` chỉ nhận câu mà chính người dùng từng trả lời sai (`BadRequest` với câu khác).
- **Chống farm điểm:** chế độ này không cộng XP/tim, nên không phá sổ cái `xp_events`.
- **Chỉ nội dung Published:** lọc `Status == "Published"`.
- **Múi giờ:** ngày trong báo cáo tính theo UTC+7.
- **Không đổi cấu trúc database, không có migration.**

### 3.4. File đã sửa
| File | Sửa gì |
|---|---|
| `Mimo.Application/DependencyInjection.cs` | Đăng ký `IProService` |
| `Mimo.Application/Repositories/ILeaderboardRepository.cs` | `UserWeeklyXpRecord.IsPro` |
| `Mimo.Infrastructure/Repository/LeaderboardRepository.cs` | Truy vấn tính `IsPro` (đang Pro và chưa hết hạn) |
| `Mimo.Application/DTOs/Leaderboard/LeaderboardDtos.cs` | `LeaderboardEntryDto.IsPro` |
| `Mimo.Application/Services/LeaderboardService.cs` | Gán `IsPro` cho top 30 và dòng của người dùng hiện tại (nạp thêm `Stats`) |
| `Mimo.Application/Services/UserService.cs` | Sửa 2 lỗi trạng thái: `"Completed"` → `"completed"` (phiên) và `"done"` (tiến độ node) |

## 4. FRONTEND (React 19 + Vite)

### 4.1. File mới
| File | Vai trò |
|---|---|
| `src/hooks/useProStatus.js` | Đọc trạng thái Pro từ `AuthContext` (nguồn: `/auth/me`): `isPro`, `planName`, `daysLeft`, `streakFreezes` |
| `src/services/modules/proService.js` | Gọi 3 API `/pro/*` |
| `src/components/pro/ProBadge.jsx` | Huy hiệu vương miện |
| `src/components/pro/ProLockedCard.jsx` | Thẻ giới thiệu tính năng cho người dùng Free, kèm nút nâng cấp |
| `src/components/pro/ProStatusCard.jsx` | Thẻ trạng thái Pro: gói, ngày còn lại, quyền lợi "ĐANG BẬT", nhắc gia hạn khi ≤ 7 ngày |
| `src/components/pro/ProRiskReportCard.jsx` | Báo cáo rủi ro (Pro) hoặc thẻ giới thiệu (Free) |
| `src/components/pro/ProDeepReview.jsx` | Ôn tập chuyên sâu: hỗ trợ câu dạng chọn, sắp xếp, tìm điểm bất thường |

### 4.2. File đã sửa
| File | Sửa gì |
|---|---|
| `layouts/LearnerLayout/LearnerLayout.jsx` | **Sửa nguyên nhân gốc:** số liệu thanh trên lấy từ tài khoản thật (tim, streak, XP, bùa, thời gian hồi tim, mục tiêu ngày); gọi `refreshUser()` mỗi lần vào khu học tập |
| `layouts/LearnerLayout/LearnerTopHeader.jsx` | Dùng `useProStatus` (bỏ cách đoán bằng chuỗi `PLUS` trong localStorage); viền vàng cho Pro; chip "👑 PRO · còn N ngày"; nút Free đổi thành "NÂNG CẤP PRO" |
| `layouts/LearnerLayout/LearnerRightWidgets.jsx` | Widget thay đổi theo Pro/Free; bỏ cảnh báo "dùng thử 7 ngày" giả, nút chuyển tới trang nâng cấp |
| `layouts/LearnerLayout/LearnerSidebar.jsx` | Mục "👑 Mimo Pro" (Free: "⭐ Nâng cấp") |
| `pages/learner/ProfileLearnerPage.jsx` | Thêm `ProStatusCard` và `ProRiskReportCard`; trạng thái Pro dùng hook |
| `pages/learner/PracticeRoomPage.jsx` | Tách phần cũ thành `StandardPractice`; thêm 2 tab "Ôn tập hồi tim" và "Ôn tập chuyên sâu" (Free thấy ổ khóa) |
| `pages/learner/LeaderboardPage.jsx` | Vương miện cạnh tên người dùng Pro (top 3 và danh sách) |
| `pages/learner/LessonPlayPage.jsx` | Hiện ∞ thay số tim cho Pro |
| `pages/learner/UpgradePlanPage.jsx` | Bảng quyền lợi trung thực: bỏ quyền lợi chưa có, ghi "Sắp ra mắt", thay bằng quyền lợi thật |

## 5. KIỂM TRA ĐÃ LÀM
- `dotnet build`: 0 lỗi, 0 cảnh báo. `vite build` pass. `oxlint`: không có cảnh báo mới loại lỗi thật.
- Chạy giao diện cục bộ (chế độ mock), nhập trạng thái Pro vào `localStorage`:
  - **Pro:** thanh trên có chip "PRO · còn 25 ngày" và viền vàng; sidebar "Mimo Pro"; thẻ Pro hiện 25 ngày còn lại và 5 quyền lợi "ĐANG BẬT"; tab "Ôn tập chuyên sâu" xuất hiện.
  - **Free:** hiện "4/5" tim, nút "NÂNG CẤP PRO", thẻ báo cáo rủi ro bị khóa kèm nút nâng cấp.
- Thẻ báo cáo rủi ro khi gọi server Render hiện lỗi 404, đúng như dự kiến vì server chưa deploy bản có `/pro/*`.

## 6. CHƯA KIỂM TRA / HẠN CHẾ
- **Các API `/pro/*` chưa test với database thật** (không có Postgres cục bộ). Cần thử sau khi deploy: đăng nhập tài khoản Pro, mở Hồ sơ và Phòng ôn tập.
- **Dạng câu hỏi sắp xếp và tìm điểm bất thường** trong `ProDeepReview` viết theo cấu trúc payload mà `LessonPlayPage` đang dùng (`payload.items`, `payload.flags`); seed hiện chỉ có dạng chọn, nên 2 dạng này chưa chạy thử.
- Thanh trên cùng: `todayXp` đặt 0 (chưa có API XP trong ngày); hạng đấu và vài số phụ trong popup vẫn là dữ liệu mẫu.
- Báo cáo gửi phụ huynh, chứng chỉ QR, mô phỏng 3D, hỗ trợ 1:1: chưa làm, đã ghi "Sắp ra mắt" trên trang giá.
- "Không quảng cáo": ứng dụng hiện không có quảng cáo nên chưa có gì để tắt.
- Muốn thấy khác biệt trên web thật: cần deploy cả BE (Render) và FE (Vercel), và đặt biến `SePay__*` nếu dùng thanh toán.

## 7. CÁCH THỬ SAU KHI DEPLOY
1. Đăng nhập tài khoản Pro (đang còn hạn). Thanh trên phải hiện "PRO · còn N ngày", tim hiển thị ∞.
2. Vào **Hồ sơ**: thấy thẻ Pro và báo cáo rủi ro (cần đã làm vài bài học để có dữ liệu).
3. Vào **Phòng ôn tập → 👑 Ôn tập chuyên sâu**: làm một câu; có giải thích, không đổi XP/tim.
4. Đăng nhập tài khoản Free: các thẻ trên bị khóa; gọi trực tiếp `GET /api/v1/pro/risk-report` phải nhận 403.
5. Vào **Bảng xếp hạng**: người dùng Pro có vương miện.
