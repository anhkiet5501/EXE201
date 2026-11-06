# QUYỀN LỢI MIMO PRO (đã có thật trong code)

Bối cảnh: trước đây Pro chỉ khác Free ở biểu tượng "vô hạn tim" và một huy hiệu nhỏ. Thanh trên cùng còn hiển thị số liệu MẪU
cố định (7 streak, 1.250 XP, 4/5 tim) cho mọi tài khoản, và trang giá quảng cáo nhiều quyền lợi chưa hề tồn tại.

Tuân thủ AGENT.md: server là nguồn sự thật (kiểm tra Pro ở BE, 403 nếu không phải Pro), Zero Leakage (không trả `CorrectData`,
không trả giải thích trước khi trả lời), múi giờ UTC+7 cho báo cáo ngày, không thay đổi cấu trúc database.

## Quyền lợi theo spec (docs/Tai_Lieu_Dac_Ta_Du_An...)
| Quyền lợi | Trạng thái |
|---|---|
| Vô hạn tim | Có sẵn từ trước; nay hiển thị rõ: ∞ ở thanh trên, ở màn học bài |
| Mở khóa phòng luyện tập chuyên sâu các tình huống sai | MỚI: tab "👑 Ôn tập chuyên sâu" |
| Báo cáo rủi ro chi tiết | MỚI: thẻ "Báo cáo rủi ro an toàn" ở trang Hồ sơ |
| Không quảng cáo | Hiện chưa có quảng cáo nào trong ứng dụng |
| Bùa Streak Freeze theo gói (3 tháng +1, 6 tháng +2) | Có sẵn; nay hiển thị số bùa |

## API mới (cần đăng nhập, chỉ Pro còn hạn, Free nhận 403)
- `GET /api/v1/pro/risk-report`: độ chính xác 30 ngày theo chủ đề, top 5 câu sai nhiều nhất, xu hướng 7 ngày, gợi ý chủ đề cần ưu tiên, số ngày Pro còn lại.
- `GET /api/v1/pro/deep-review`: các câu từng làm sai (mọi thời điểm, kể cả đã giải quyết), không kèm đáp án.
- `POST /api/v1/pro/deep-review/answer`: chấm ở server, trả đúng/sai + giải thích + nguồn. Không cộng XP, không đổi trạng thái (tránh farm điểm).
  Chỉ cho ôn các câu chính người dùng từng sai, nên không dùng được để dò đáp án toàn bộ ngân hàng câu hỏi.
- `GET /api/v1/leaderboard/current`: mỗi dòng có thêm `isPro`.

## Hiển thị (Frontend)
- Thanh trên cùng: số liệu thật của tài khoản (tim, streak, XP, bùa); Pro có viền vàng và chip "👑 PRO · còn N ngày".
- Sidebar: mục "👑 Mimo Pro" (Free: "⭐ Nâng cấp"). Widget bên phải: Pro thấy trạng thái, Free thấy lời mời nâng cấp (bỏ cảnh báo "dùng thử 7 ngày" giả).
- Hồ sơ: thẻ trạng thái Pro (gói, ngày còn lại, quyền lợi đang bật, nhắc gia hạn khi còn <= 7 ngày) và báo cáo rủi ro; Free thấy thẻ giới thiệu có nút nâng cấp.
- Phòng ôn tập: hai tab "Ôn tập hồi tim" và "Ôn tập chuyên sâu" (Free thấy ổ khóa).
- Bảng xếp hạng: vương miện cạnh tên thành viên Pro.
- Trang giá: bỏ các quyền lợi chưa có (trợ lý AI, mô phỏng 3D, chứng chỉ QR, kết nối phụ huynh, hỗ trợ 1:1...), ghi rõ "Sắp ra mắt" hoặc thay bằng quyền lợi thật.

## Lỗi liên quan đã sửa
- `GetStudyStatsAsync` so sánh trạng thái sai chữ hoa/thường ("Completed" thay vì "completed", "done"), nên số liệu học tập ở Hồ sơ luôn bằng 0.
- Trạng thái Pro ở giao diện lấy từ Backend qua `useProStatus`, bỏ cách đoán bằng chuỗi `PLUS` trong localStorage.

## Hạn chế / chưa làm
- `todayXp` ở thanh trên hiện đặt 0 (chưa có API XP trong ngày); mục tiêu ngày = số phút mục tiêu x 5.
- Hạng đấu và một số số liệu phụ trong popup thanh trên vẫn là dữ liệu mẫu.
- Các endpoint `/pro/*` chưa kiểm thử với database thật (không có Postgres cục bộ); cần thử sau khi deploy.
- Chưa làm: báo cáo gửi phụ huynh, chứng chỉ QR, mô phỏng 3D (đã ghi "Sắp ra mắt").
