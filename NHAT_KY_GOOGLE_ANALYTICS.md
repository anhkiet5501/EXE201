# NHẬT KÝ: GẮN GOOGLE ANALYTICS 4 VÀO MIMO

Phạm vi: chỉ Frontend (React). Không đổi Backend, không đổi database.
Luồng dữ liệu GA4: **MIMO Web**, địa chỉ `https://mimo-education.vercel.app`, Mã đo lường `G-SBM49KZN59` (mã công khai, không phải bí mật).

## 1. Cách hoạt động
1. Người dùng vào web lần đầu → hiện **banner đồng ý cookie**. **Chưa đồng ý thì không nạp bất kỳ script nào của Google.**
2. Bấm **Đồng ý** → nạp `gtag.js`, gửi lượt xem trang hiện tại. Bấm **Từ chối** → không gửi gì, lựa chọn được nhớ trong `localStorage` (`mimo_analytics_consent`).
3. Sau đó mỗi lần đổi trang, đăng nhập, đăng xuất... ứng dụng gửi sự kiện về GA4.
4. Chỉ chạy ở **bản build thật** (mã đo lường mặc định chỉ có trong `import.meta.env.PROD`). Chạy local không gửi gì, trừ khi đặt biến `VITE_GA_MEASUREMENT_ID`.

## 2. Sự kiện được gửi
| Thời điểm | Sự kiện | Thông số |
|---|---|---|
| Mỗi lần đổi trang | `page_view` | `page_path` (chỉ đường dẫn, không kèm query như mã giao dịch) |
| Đăng nhập thành công | `login` | `method` (email), `role` |
| Đăng ký thành công | `sign_up` | `method`, `account_type` (learner/business/curator) |
| Bấm đăng xuất | `logout` | `role`, `reason: manual` |
| Bị đăng xuất do hết phiên (401) | `logout` | `reason: session_expired` |
| Thanh toán Pro thành công | `purchase` | `transaction_id`, `value`, `currency: VND`, `items` |
| Hoàn thành bài học | `lesson_complete` | `perfect`, `xp_earned`, `hearts_lost` |

Gắn người dùng: sau khi đăng nhập gửi `user_id` = **mã GUID nội bộ** và thuộc tính `role`, `plan` (free/pro). Khi gói đổi từ Free sang Pro, thuộc tính tự cập nhật.

## 3. Quyền riêng tư
- **Không gửi** email, tên, số điện thoại (Google cấm đưa thông tin nhận dạng cá nhân vào GA).
- Chỉ gửi đường dẫn, không gửi tham số query.
- Cần đồng ý cookie trước khi nạp script. MIMO có học sinh nhỏ tuổi: nên đối chiếu với Nghị định 13/2023 về bảo vệ dữ liệu cá nhân.
- GA4 **không** cho xem "ai đã đăng nhập lúc mấy giờ" theo tên. Nếu cần lịch sử đăng nhập theo từng người cho Admin, phải làm bảng lịch sử đăng nhập trong database MIMO (chưa làm).

## 4. File
**Mới**
- `Mimo_EXE201_FE/src/utils/analytics.js`: nạp GA có kiểm soát, `trackEvent`, `trackPageView`, `identifyUser`, `clearUser`, lưu lựa chọn cookie.
- `Mimo_EXE201_FE/src/components/common/CookieConsent.jsx`: banner Đồng ý / Từ chối.

**Sửa**
- `src/App.jsx`: khởi tạo GA, gửi `page_view` mỗi khi đổi route, hiện banner.
- `src/contexts/AuthContext.jsx`: `login` (sự kiện `login`, gắn user), `logout` (sự kiện `logout`, bỏ gắn user), cập nhật thuộc tính khi đổi gói.
- `src/services/api/apiClient.js`: sự kiện `logout` khi hết phiên.
- `src/pages/auth/RegisterPage.jsx`: sự kiện `sign_up`.
- `src/pages/learner/UpgradePlanPage.jsx`: sự kiện `purchase` khi BE xác nhận thanh toán.
- `src/pages/learner/LessonPlayPage.jsx`: sự kiện `lesson_complete`.

## 5. ĐÃ KIỂM TRA
- `vite build` pass; `oxlint` không có lỗi hay cảnh báo mới loại lỗi thật.
- Chạy cục bộ với mã giả `G-TEST000000` (không làm bẩn dữ liệu thật):
  - Chưa đồng ý: hiện banner, **không** có script Google, `dataLayer` rỗng.
  - Bấm Đồng ý: banner ẩn, script `gtag.js` được nạp, có `config` và `page_view`; đổi sang trang khác sinh thêm `page_view`.
- Chưa thử đăng nhập/đăng xuất thật (cần Backend đăng nhập được) và chưa gửi dữ liệu thật tới GA.

## 6. VIỆC BẠN CẦN LÀM
1. **Deploy Frontend (Vercel)**: merge nhánh vào `main` như các lần trước. Backend không cần đổi.
2. Mở web bằng Ctrl+F5, bấm **Đồng ý** ở banner.
3. Vào GA → **Báo cáo → Thời gian thực**: phải thấy 1 người dùng và sự kiện `page_view`. Cảnh báo "Bạn chưa bật tính năng thu thập dữ liệu" biến mất sau khi có dữ liệu (có thể mất đến 48 giờ; Thời gian thực thấy ngay).
4. Đăng ký tham số tùy chỉnh để lọc báo cáo: **Quản trị → Định nghĩa tùy chỉnh → Tạo phương diện tùy chỉnh** (phạm vi: *Sự kiện*) cho `method`, `reason`, `account_type`; (phạm vi: *Người dùng*) cho `role`, `plan`. Dữ liệu tùy chỉnh hiện sau khoảng 24 giờ.
5. Báo cáo "Đăng xuất": **Khám phá → Tạo khám phá trống**, dùng sự kiện `logout`, chia theo `reason`.
6. Tùy chọn: **Quản trị → Luồng dữ liệu → MIMO Web → Đo lường nâng cao** đã bật; có thể bật **Lọc lưu lượng truy cập nội bộ** để loại số liệu của đội phát triển.

## 7. CHƯA LÀM / HẠN CHẾ
- Lịch sử đăng nhập theo từng người cho Admin (cần bảng database mới và trang Admin).
- Đăng nhập bằng Google/Facebook/Apple trên trang đăng nhập hiện chưa phải đăng nhập thật nên `method` luôn là `email`.
- Số liệu thực tế thường cao hơn con số GA hiển thị vì trình chặn quảng cáo chặn được GA.
- Đoạn mã `GTM-WSHGV8PM` mà Google đề xuất không dùng; code dùng trực tiếp Mã đo lường `G-...` để tránh nạp hai lần.
