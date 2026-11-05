# NHẬT KÝ SỬA LỖI FRONTEND (đợt rà soát lỗi web)

Phạm vi: 3 lỗi — (2) đăng nhập vào được bằng tài khoản mẫu, (3) bài học/dữ liệu giả khi Backend lỗi,
(4) trang `/payment-result` tự gán Pro. Lỗi "trang kết quả thanh toán thất bại bị trắng trang" (biến `message`)
được xử lý luôn khi viết lại trang ở mục 4 (nhánh thất bại giờ có `message` từ BE).

Kiểm tra: `vite build` pass; `oxlint` 0 lỗi (chỉ còn cảnh báo kiểu cũ, không có cảnh báo mới loại lỗi thật).
Chưa kiểm thử end-to-end với Backend thật.

## 0. File mới
- `src/services/api/mockConfig.js`
  - `USE_MOCK`: nguồn duy nhất, chỉ bật khi `VITE_USE_MOCK=true` (mặc định TẮT).
    Trước đây `learnerService` mặc định BẬT mock khi biến khác `'false'`, còn `authService` mặc định TẮT — không đồng nhất.
  - `getApiErrorMessage(err)`: lấy thông điệp lỗi (hỗ trợ RFC 7807: `detail`/`message`/`title`).
  - `isConnectionError(err)`: true nếu mất mạng/timeout/5xx (đáng thử lại).

## 1. Lỗi 2 — Đăng nhập thất bại vẫn vào được bằng tài khoản mẫu
- `src/services/modules/authService.js`: xóa nhánh fallback trong `catch` của `login` (trước đây khi BE lỗi — kể cả sai mật khẩu —
  chuyển sang `mockAccounts`, nhận mật khẩu `123`/`admin123`). Nay lỗi được ném ra nguyên vẹn. Nhánh mock chỉ chạy khi `USE_MOCK`.
- `src/services/api/apiClient.js`: token `mock-token-*` chỉ được bỏ qua 401 khi `USE_MOCK` bật; nếu không, 401 sẽ đăng xuất về `/login`.
- `src/pages/auth/LoginPage.jsx`: thông báo lỗi phân biệt
  - mất kết nối/5xx: "Máy chủ đang khởi động hoặc mất kết nối. Vui lòng thử lại sau vài giây!"
  - 401: "Email hoặc mật khẩu không đúng."
  - khác: thông điệp từ BE.

## 2. Lỗi 3 — Bài học giả / dữ liệu mẫu khi BE từ chối
- `src/services/modules/learnerService.js` (viết lại):
  - Thêm `withMockFallback`: chỉ rơi về dữ liệu mẫu khi `USE_MOCK`; ở chế độ thường lỗi BE được ném ra.
  - `startLesson`: bỏ catch-all trả `mock-session-*` và bỏ ánh xạ ID mẫu sang GUID cứng (chỉ còn trong chế độ mock).
    Hết tim / bài bị khóa / chưa xuất bản giờ báo đúng, không còn vào bài giả.
  - `submitAnswer`, `completeSession`: nhánh `mock-session-*` chỉ chạy khi `USE_MOCK`.
  - Các hàm đọc dữ liệu (domains, path, unit, leaderboard, dashboard, wrong-questions, classroom, quests, shop, achievements,
    handbook, study-stats) và `leaveClassroom`: cùng quy tắc trên.
  - `joinClassroom`: giữ nguyên thông điệp lỗi thật của BE (mã sai, hết ghế, lớp đầy); mock DB chỉ khi `USE_MOCK`.
  - `claimQuest`: sửa đường dẫn sai (`/api/learner/quests/claim` → `API_ENDPOINTS.QUESTS.CLAIM`).
- `src/pages/learner/LessonPlayPage.jsx`:
  - Màn hình lỗi khi không vào được bài (kèm nút "Thử lại" nếu lỗi kết nối, "Đến phòng ôn tập" nếu hết tim, "Về bản đồ").
  - Lỗi mạng khi nộp đáp án: KHÔNG còn coi là "trả lời sai" và KHÔNG còn trừ tim ở client; hiện thông báo, cho gửi lại.
  - `Idempotency-Key` cố định theo `sessionId_questionId` (trước đây kèm `Date.now()` nên mỗi lần gửi là một khóa mới).
  - Chống gửi trùng bằng `useRef` (Enter hai lần nhanh không còn gửi hai request).
  - `completeSession` thất bại: không còn pháo hoa/"hoàn thành" giả; hiện lỗi và cho thử lại.
- `src/layouts/LearnerLayout/LearnerLayout.jsx`:
  - Chế độ thật: giá trị ban đầu không còn là cây kỹ năng/chủ đề/bảng xếp hạng mẫu; không còn rơi về `mockLearnerData.units`.
  - Có banner lỗi + nút "Thử lại" khi tải dữ liệu thất bại; `claimQuest` có xử lý lỗi.
- `src/pages/learner/PracticeRoomPage.jsx`: lỗi nộp đáp án ôn tập không còn giả lập "đúng + hồi tim" ở client (chỉ khi `USE_MOCK`); hiện lỗi thật.
- `src/pages/learner/MyClassroomPage.jsx`: thêm xử lý lỗi khi rời lớp; dùng `getApiErrorMessage` cho lỗi vào lớp.

## 3. Lỗi 4 — `/payment-result` tự gán Pro
- `src/pages/learner/PaymentResultPage.jsx` (viết lại):
  - Không còn mặc định "thành công" khi URL không có tham số; không còn ghi `isPro:true` vào `localStorage` theo URL.
  - Trạng thái LẤY TỪ BACKEND: lấy `txnRef` từ URL rồi gọi `GET /payment/history` để tìm giao dịch; hỏi lại mỗi 3 giây, tối đa 10 lần.
    Các trạng thái: đang xác nhận / thành công / thất bại / chưa nhận được xác nhận (có nút "Kiểm tra lại").
  - Số tiền, gói, phương thức hiển thị theo dữ liệu giao dịch của BE (không còn mặc định 399.000 đ / gói 6 tháng).
  - Chỉ khi BE báo `Success` mới gọi `refreshUser()` để cập nhật Pro; nhánh thất bại có `message` (sửa lỗi trắng trang).
  - Bỏ chữ cố định "VNPay Sandbox"; vẫn tương thích luồng VNPay cũ (tham số `vnp_*` được gửi cho BE xác thực trước khi hỏi trạng thái).
- `src/routes/index.jsx`: route `/payment-result` nằm trong `RoleGuard` (bắt buộc đăng nhập). Đã kiểm tra trên trình duyệt:
  chưa đăng nhập → chuyển về `/login`, không ghi gì vào `localStorage`.
- `src/contexts/AuthContext.jsx`: thêm `refreshUser()` (đồng bộ `/auth/me`), dùng chung cho effect khởi động;
  `JSON.parse` của `mimo_user` có `try/catch` (dữ liệu hỏng không còn làm sập app).

## 4. Hành vi thay đổi cần biết
- Tài khoản mẫu (`admin@mimo.com / 123`...) chỉ còn dùng được khi chạy `VITE_USE_MOCK=true`.
- Mất kết nối tới BE sẽ hiện lỗi/nút "Thử lại" thay vì dữ liệu mẫu — đây là hành vi mong muốn, nhưng sẽ làm lộ các lỗi BE trước đây bị che.
- Máy chủ Render ngủ đông có thể làm lần gọi đầu chậm (timeout 45s) → người dùng thấy thông báo "đang khởi động".

## 5. Chưa xử lý (còn tồn)
- Các service khác (`adminService`, `businessService`, `curatorService`, `educatorService`) vẫn dùng mock/fallback riêng và `USE_MOCK` riêng trong từng file.
- `LearnerLayout` vẫn trộn `mockLearnerData` cho các trường chưa có API (`stats`, `dailyQuests`, `weeklyTip`, `classroom`...).
- `PracticeRoomPage` vẫn có câu hỏi mẫu cố định khi người dùng chưa có câu sai (khi nộp sẽ báo lỗi từ BE thay vì giả lập).
- Trang đăng nhập còn nút "Cổng vào nhanh 5 Role mẫu" và nút Google/Facebook/Apple đều đăng nhập bằng tài khoản mẫu cố định
  (có cả mật khẩu admin trong mã nguồn FE) — nên gỡ khỏi bản Production.
- `RoleGuard` chỉ kiểm tra phía client; `/business` vẫn cho role `LEARNER` — cần BE chặn đúng.
- Nội dung "VNPay" trong `UpgradePlanPage`/`paymentService` và nút "giả lập" chưa gỡ (đợi chọn cổng thanh toán thật).
- Rác ở gốc FE (`new_render_functions.jsx`, `*.py`, `_legacy/`) và bundle 1 MB chưa chia nhỏ.
