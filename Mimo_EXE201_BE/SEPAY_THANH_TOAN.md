# THANH TOÁN CHUYỂN KHOẢN QUA SEPAY (VietQR + Webhook)

Thay thế luồng VNPay sandbox và nút "giả lập". Không đổi cấu trúc database (không có migration):
đơn thanh toán lưu trong bảng `Transactions` với `PaymentMethod = BankTransfer`.

## 1. Luồng hoạt động
1. Người dùng chọn gói ở `/learn/upgrade` → FE gọi `POST /api/v1/payment/create-order {planCode}`.
2. BE tạo đơn `Pending` với mã đơn dạng `MIMO` + 8 ký tự (ví dụ `MIMOK7P2QXA9`), trả về số tiền, thông tin ngân hàng, URL mã QR VietQR.
   Nếu người dùng đã có đơn cùng gói còn hạn thì dùng lại, không tạo đơn mới.
3. Người dùng quét QR và chuyển khoản, nội dung = mã đơn.
4. SePay gửi webhook `POST /api/v1/payment/sepay-webhook` (header `Authorization: Apikey <SePay__ApiKey>`).
5. BE kiểm tra: tiền vào, chưa xử lý trước đó (theo id giao dịch SePay), khớp mã đơn, số tiền >= giá gói → đánh dấu `Success` và kích hoạt Pro trong một transaction.
6. FE hỏi `GET /api/v1/payment/order/{txnRef}` mỗi 3 giây; khi `Success` thì gọi `/auth/me` để cập nhật Pro. Quyền Pro chỉ do BE cấp.

Quy tắc xử lý webhook (mọi trường hợp hợp lệ trả HTTP 200 `{"success":true,"outcome":...}`; lỗi hệ thống trả 5xx để SePay gửi lại):
- `Processed`: đã kích hoạt gói.
- `Duplicate`: SePay gửi lại cùng giao dịch, hoặc đơn đã được thanh toán trước đó (có thể chuyển dư, cần đối soát tay, xem log).
- `Ignored`: không phải tiền vào, không có mã `MIMO…`, không khớp đơn, hoặc chuyển thiếu tiền (ghi log cảnh báo để xử lý tay).
- Tiền về sau khi đơn hết hạn hiển thị (30 phút) vẫn được kích hoạt.
- Sai/thiếu API Key → 401. Chưa cấu hình `SePay__ApiKey` → từ chối tất cả.

## 2. Biến môi trường (đặt ở Render → Environment, KHÔNG commit)
| Biến | Ý nghĩa |
|---|---|
| `SePay__ApiKey` | Khóa tạo ở SePay → Tích hợp WebHooks (xác thực API Key) |
| `SePay__BankCode` | Tên ngân hàng theo SePay QR, ví dụ `TPBank` |
| `SePay__AccountNumber` | Số tài khoản nhận tiền |
| `SePay__AccountName` | Tên chủ tài khoản (hiển thị cho người chuyển) |
| `SePay__OrderPrefix` | Mặc định `MIMO`, phải trùng tiền tố cấu hình ở SePay |
| `SePay__OrderExpiryMinutes` | Mặc định `30` |

## 3. Cấu hình ở SePay
- Webhook: loại giao dịch **Tiền vào**, định dạng **JSON**, bật tự động gửi lại, xác thực **API Key**.
- URL: `https://mimo-be-api.onrender.com/api/v1/payment/sepay-webhook`

## 4. Cách thử
Tạo đơn trên web, lấy mã đơn rồi giả lập webhook (thay `<KEY>` và `<MÃ_ĐƠN>`):

```bash
curl -X POST https://mimo-be-api.onrender.com/api/v1/payment/sepay-webhook \
  -H "Content-Type: application/json" -H "Authorization: Apikey <KEY>" \
  -d '{"id":900001,"gateway":"TPBank","transferType":"in","transferAmount":79000,"content":"<MÃ_ĐƠN>"}'
```

Kết quả mong đợi: `{"success":true,"outcome":"Processed"}`, gửi lại lần hai cho ra `Duplicate`, web tự chuyển sang "Kích hoạt thành công".
Sau đó nên thử một giao dịch thật số tiền nhỏ trước khi mở cho người dùng. Cần xác nhận mã QR (tham số `acc`, `bank`, `amount`, `des` của `qr.sepay.vn`) hiển thị đúng ngân hàng và số tiền.

## 5. Thay đổi liên quan
- Mã code: `PaymentService` (CreateOrder, GetOrderStatus, ProcessSePayWebhook), `PaymentPlans` (bảng giá một chỗ), `SePayOptions`.
- Kích hoạt Pro gom về một hàm `ActivatePlanAsync`, dùng chung với luồng VNPay cũ.
- Pro hết hạn: `UserStats.ExpireProIfNeeded` (gọi trong `CalculateCurrentHearts`) hạ `IsPro` khi `ProExpiresAt` đã qua. Pro không có ngày hết hạn (cấp tay) giữ nguyên.
- Đã xóa: endpoint `mock-activate`, nút giả lập ở `UpgradePlanPage`, modal "Giả lập quét QR" của `MimoPlusUpgradeModal` (nay chuyển tới `/learn/upgrade`).
- Còn lại, chưa xóa: các endpoint VNPay (`create-vnpay-url`, `vnpay-return`, `vnpay-ipn`) không còn được FE gọi (trừ `vnpay-return` cho tương thích). Có thể xóa sau.
- `BusinessBillingPage` (B2B) vẫn còn nút "Giả lập quét QR", chưa đụng tới.

## 6. Chưa kiểm thử
Đã chạy thử API cục bộ: webhook sai/thiếu key → 401, giao dịch tiền ra → bỏ qua, `create-order` không token → 401, `mock-activate` → 404.
Chưa kiểm thử các nhánh cần database (tạo đơn, khớp đơn, kích hoạt Pro) và chưa thử với SePay thật.
