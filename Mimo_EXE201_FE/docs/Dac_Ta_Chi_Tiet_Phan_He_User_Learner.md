# TÀI LIỆU ĐẶC TẢ CHI TIẾT PHÂN HỆ: NGƯỜI HỌC (LEARNER / USER)
## NỀN TẢNG HỌC KỸ NĂNG SỐNG & AN TOÀN GAMIFIED — MIMO PLATFORM

> **Dự án:** EXE201 — Khởi nghiệp & Phát triển Sản phẩm  
> **Phân hệ:** Người học cá nhân (Learner Portal - B2C)  
> **Mục tiêu:** Mô tả chi tiết 100% cấu trúc giao diện, thanh công cụ, các nút chức năng, luồng tương tác và trạng thái hoạt động của phân hệ Người học.

---

## MỤC LỤC
1. [TỔNG QUAN PHÂN HỆ & BỐ CỤC KHÔNG GIAN](#1-tổng-quan-phân-hệ--bố-cục-không-gian)
2. [THANH CÔNG CỤ ĐIỀU HƯỚNG BÊN TRÁI (LEFT SIDEBAR)](#2-thanh-công-cụ-điều-hướng-bên-trái-left-sidebar)
3. [THANH TRẠNG THÁI TRÊN CÙNG (TOP HEADER / STATS BAR)](#3-thanh-trạng-thái-trên-cùng-top-header--stats-bar)
4. [CỘT TIỆN ÍCH BÊN PHẢI (RIGHT WIDGETS SIDEBAR)](#4-cột-tiện-ích-bên-phải-right-widgets-sidebar)
5. [KHU VỰC TRUNG TÂM — BẢN ĐỒ HỌC TẬP (THE SNAKE LEARNING PATH)](#5-khu-vực-trung-tâm--bản-đồ-học-tập-the-snake-learning-path)
6. [MÀN HÌNH CHƠI TÌNH HUỐNG (SCENARIO GAME ENGINE - ZEN MODE)](#6-màn-hình-chơi-tình-huống-scenario-game-engine---zen-mode)
7. [MÀN HÌNH BẢNG XẾP HẠNG & GIẢI ĐẤU (LEAGUES SCREEN)](#7-màn-hình-bảng-xếp-hạng--giải-đấu-leagues-screen)
8. [MÀN HÌNH PHÒNG ÔN TẬP & HỒI TIM (PRACTICE ROOM)](#8-màn-hình-phòng-ôn-tập--hồi-tim-practice-room)
9. [MÀN HÌNH KHO THÀNH TÍCH & HỒ SƠ CÁ NHÂN (PROFILE & BADGES)](#9-màn-hình-kho-thành-tích--hồ-sơ-cá-nhân-profile--badges)
10. [MÀN HÌNH LỚP HỌC & NHẬP MÃ B2B (MY CLASSROOM)](#10-màn-hình-lớp-học--nhập-mã-b2b-my-classroom)

---

## 1. TỔNG QUAN PHÂN HỆ & BỐ CỤC KHÔNG GIAN

Phân hệ Người học được thiết kế theo tỷ lệ chuẩn của các ứng dụng EdTech hàng đầu thế giới (Duolingo, Getmimo). Bố cục chia thành **3 cột độc lập** trên Desktop và tự động co dãn thành **1 cột mượt mà** trên Mobile.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 BỐ CỤC TỔNG THỂ TRÊN DESKTOP                           │
├─────────────────────┬────────────────────────────────────────────┬─────────────────────┤
│   CỘT TRÁI (260px)  │           CỘT GIỮA (Max 620px)             │   CỘT PHẢI (340px)  │
│                     ├────────────────────────────────────────────┤                     │
│  [LOGO & MASCOT]    │  [THANH HEADER: CHỦ ĐỀ • STREAK • XP • TIM]│  [WIDGET MIMO PRO]  │
│  • 🏠 Học tập       ├────────────────────────────────────────────┤  [WIDGET BXH TUẦN]  │
│  • 🏆 Bảng xếp hạng │                                            │  [WIDGET NHIỆM VỤ]  │
│  • ⚡ Nhiệm vụ ngày │     BẢN ĐỒ HỌC TẬP UỐN LƯỢN (SNAKE PATH)   │  [MẸO AN TOÀN TUẦN] │
│  • 🏅 Thành tích    │                                            │                     │
│  • 📚 Cẩm nang học tập│    (●) Nút 1: Bỏng nước sôi               │                     │
│  • 🏫 Lớp học của tôi│    ／                                      │                     │
│  • 👤 Hồ sơ cá nhân │  (●) Nút 2: Vết thương hở                   │                     │
│  • ⚙️ Cài đặt & Khác│    ＼                                      │                     │
│                     │      (🎁) Rương thưởng XP                   │                     │
└─────────────────────┴────────────────────────────────────────────┴─────────────────────┘
```

---

## 2. THANH CÔNG CỤ ĐIỀU HƯỚNG BÊN TRÁI (LEFT SIDEBAR)

Thanh Sidebar nằm cố định (Sticky) ở cạnh trái màn hình, chiều rộng `260px`, viền phải `border-right: 2px solid #E2E8F0`. Giúp người học dễ dàng chuyển đổi các tính năng cốt lõi chỉ bằng 1 cú click.

### 2.1. Khối Thương hiệu (Brand & Mascot Header)
* **Vị trí:** Trên cùng của thanh Sidebar.
* **Thành phần:**
  * **Logo MIMO:** Chữ "mimo" viết thường, typography bo tròn hiện đại, đậm chất công nghệ giáo dục.
  * **Linh vật Robot Mimo 🤖:** Icon robot nhỏ hiển thị trạng thái sinh động. Khi hover vào, Robot nháy mắt hoặc vẫy tay chào người học.
  * **Badge phiên bản:** Nhãn nhỏ `BETA` hoặc `v2.0` màu xanh lá pastel.

---

### 2.2. Danh sách các Tab Chức năng Cốt lõi (Navigation Menu Items)
Mỗi mục menu được thiết kế dạng thẻ bo tròn `border-radius: 12px`, padding rộng rãi, có hiệu ứng hover đổi màu nền và active nổi bật:

```
┌───────────────────────────────────────────────────────────┐
│ [Icon]   TÊN MỤC                 [Badge phụ nếu có]      │
└───────────────────────────────────────────────────────────┘
```

#### ① Tab 1: 🏠 Học tập (Learning Path / Home)
* **Chức năng:** Màn hình chính dẫn về Bản đồ lộ trình học tập uốn lượn (Snake Path).
* **Trạng thái Active:** Nền xanh lá nhạt (`#DCFCE7`), chữ xanh lá đậm (`#15803D`), viền trái hoặc viền ngoài đậm nét.
* **Shortcut:** Nhấn phím `1` trên bàn phím.

#### ② Tab 2: 🏆 Bảng xếp hạng (Leaderboards / Leagues)
* **Chức năng:** Xem thứ hạng thi đua trong tuần của người học.
* **Hiển thị kèm theo:**
  * Huy hiệu thu nhỏ của Giải đấu hiện tại (vd: Khiên Vàng `Gold League`).
  * Chấm đỏ thông báo nếu người học vừa bị người khác vượt mặt hoặc có kết quả thăng/rớt hạng mới.
* **Shortcut:** Nhấn phím `2`.

#### ③ Tab 3: ⚡ Nhiệm vụ ngày (Daily Quests)
* **Chức năng:** Xem danh sách 3 thử thách trong ngày để kiếm thêm XP và rương báu.
* **Hiển thị kèm theo:**
  * Badge tròn màu vàng cam đếm số nhiệm vụ đã hoàn thành mà **chưa bấm nhận thưởng** (vd: `[1]`, `[2]`).
* **Shortcut:** Nhấn phím `3`.

#### ④ Tab 4: 🏅 Kho thành tích & Huy hiệu (Achievements & Badges)
* **Chức năng:** Xem bảo tàng huy hiệu đã đạt được (vd: *"Chiến thần dập lửa"*, *"Hiệp sĩ sơ cứu"*).
* **Hiển thị kèm theo:** Tỷ lệ phần trăm tổng huy hiệu đã mở khóa (vd: `8/24`).

#### ⑤ Tab 5: 📚 Cẩm nang học tập (Learning Handbook & Life Skills)
* **Tên gọi & Định vị:** **Cẩm nang học tập** (thay vì "Sổ tay Sinh tồn" để gần gũi, thân thiện và phù hợp với môi trường học đường, lứa tuổi học sinh). Đây là **Thư viện tra cứu nhanh (Quick Reference Hub)** giúp người học có thể đọc lại tóm tắt quy trình chuẩn hoặc tra cứu ngay lập tức khi gặp tình huống thực tế ngoài đời mà không cần phải chơi game.
* **Cấu trúc 5 Trụ cột Kỹ năng toàn diện bên trong:**
  1. **🚑 Sơ cấp cứu (First Aid):** Tóm tắt quy trình chuẩn: xử lý bỏng nước sôi (Nguyên tắc 3 Không), ép tim CPR (30 ép : 2 thổi), sơ cứu hóc dị vật Heimlich (người lớn & trẻ nhỏ), băng bó cầm máu, cố định gãy xương, sơ cứu đuối nước.
  2. **🔥 Thoát hiểm & PCCC (Fire & Disaster Safety):** Hướng dẫn thoát hiểm chung cư cao tầng (men theo tường, khăn ướt bịt mũi), nguyên tắc dùng bình cứu hỏa PASS (Pull-Aim-Squeeze-Sweep), quy trình 3 bước xử lý rò rỉ khí gas.
  3. **🚦 An toàn giao thông (Road Safety):** Sơ đồ nhận diện vùng điểm mù xe tải/xe container (Blind Spots), kỹ năng phản xạ khi xe mất phanh, quy trình bảo vệ hiện trường và sơ cứu nạn nhân tai nạn giao thông.
  4. **🛡️ An toàn số & Chống lừa đảo (Cyber Safety & Anti-Scam):** Cẩm nang nhận diện 10 chiêu trò lừa đảo phổ biến nhất (cuộc gọi mạo danh công an/viện kiểm sát, đường link trúng thưởng giả mạo, bẫy việc làm online, deepfake AI giả giọng người thân), checklist 5 giây trước khi chuyển tiền, cách khóa tài khoản ngân hàng khẩn cấp.
  5. **🤝 Phòng chống bạo lực & Ranh giới an toàn (Personal Safety & Boundaries):** Quy tắc 5 ngón tay bảo vệ ranh giới thân thể, kỹ năng thoát hiểm khi xảy ra giẫm đạp đám đông (Crowd crush), các bước tìm kiếm sự trợ giúp khi bị bạo lực học đường hoặc bạo lực mạng.
* **Tiện ích tích hợp đặc biệt:**
  * **🚨 Bảng SOS Một chạm (One-Touch Emergency Dials):** Nút gọi trực tiếp `114` (Cháy/Cứu hộ), `115` (Cấp cứu Y tế), `113` (Công an), `111` (Tổng đài Quốc gia Bảo vệ Trẻ em).
  * **🔍 Thanh tìm kiếm nhanh (Instant Search):** Gõ từ khóa (vd: *"bỏng"*, *"chập điện"*, *"lừa đảo link"*, *"hóc dị vật"*) hiển thị ngay thẻ hướng dẫn 3 bước hành động khẩn cấp.
  * **⚡ Chế độ Ngoại tuyến (Offline Cache):** Toàn bộ dữ liệu cẩm nang được lưu offline trên trình duyệt/thiết bị để người dùng luôn mở được ngay cả khi mất sóng điện thoại hoặc không có Internet.

#### ⑥ Tab 6: 🏫 Lớp học của tôi (My Classroom - Tích hợp B2B)
* **Chức năng:** Dành cho học sinh tham gia theo chương trình của trường học hoặc phụ huynh:
  * Nhập mã lớp học (Class Code) do giáo viên cấp (vd: `K10-PCCC`).
  * Xem danh sách bài tập bắt buộc mà thầy cô giao tuần này kèm deadline đếm ngược.
  * Hiển thị bảng xếp hạng nội bộ riêng của lớp học đó.

#### ⑦ Tab 7: 👤 Hồ sơ cá nhân (Profile)
* **Chức năng:** Xem avatar, thống kê ngày tham gia, cấp độ hiện tại, theo dõi bạn bè và quản lý tài khoản.

#### ⑧ Tab 8: ⚙️ Cài đặt & Khác (Settings & More Dropdown)
* **Chức năng:** Mở menu phụ dạng Popover:
  * Bật/tắt hiệu ứng âm thanh (Sound FX: On/Off).
  * Bật/tắt hiệu ứng rung (Haptic feedback).
  * Chuyển đổi giao diện Sáng / Tối (Light / Dark Mode).
  * Phản hồi & Báo lỗi kịch bản tình huống.
  * Đăng xuất (Logout).

---

## 3. THANH TRẠNG THÁI TRÊN CÙNG (TOP HEADER / STATS BAR)

Thanh trạng thái trên cùng có thể nằm ở đầu cột giữa hoặc trải rộng toàn bộ màn hình. Đây là **bảng điều khiển tài nguyên (Resource Dashboard)** mà người học luôn dõi mắt theo dõi từng giây.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [▼ Chủ đề: 🚑 Sơ cấp cứu]        🔥 7 Ngày        ⭐ 1.250 XP       ❤️ 4/5 Tim       🔔 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1. Bộ chọn Chủ đề Kỹ năng (Domain Selector Dropdown)
* **Vị trí:** Góc trái thanh trạng thái.
* **Giao diện:** Nút dạng Pill viền nổi, hiển thị Icon + Tên chủ đề đang học (vd: `🚑 Sơ cấp cứu cơ bản ▼`).
* **Cách hoạt động:** Khi bấm vào, xổ xuống menu danh sách 5 chủ đề lớn:
  1. `🚑 Sơ cấp cứu ban đầu (Tiến độ: 60%)`
  2. `🔥 Thoát hiểm & PCCC (Tiến độ: 30%)`
  3. `🚦 An toàn giao thông (Chưa học)`
  4. `🛡️ Chống lừa đảo & An toàn số (Tiến độ: 10%)`
  5. `🤝 Phòng chống bạo lực & Xâm hại (Chưa học)`
* Người học có thể chuyển đổi qua lại giữa các chủ đề bất kỳ lúc nào, tiến độ từng chủ đề được lưu độc lập.

---

### 3.2. Chỉ số Chuỗi ngày (🔥 Daily Streak Widget)
* **Giao diện:** Icon ngọn lửa màu cam sáng bập bùng + Số ngày liên tục (vd: `🔥 7`).
* **Trạng thái ngọn lửa:**
  * **Lửa xám (Chưa học hôm nay):** Nhắc nhở người học hôm nay chưa vào bài, nguy cơ đứt chuỗi đang cận kề.
  * **Lửa cam đỏ rực rỡ (Đã học hôm nay):** Chuỗi ngày đã được bảo vệ an toàn cho ngày hôm nay.
* **Popup chi tiết khi click vào (Streak Popover):**
  * Tiêu đề: *"Bạn đang có chuỗi 7 ngày liên tục!"*.
  * Lịch tuần mini (7 vòng tròn từ Thứ 2 đến Chủ nhật): Đánh dấu tích xanh vào những ngày đã học.
  * **Thông số Bùa Đóng Băng Chuỗi (Streak Freeze):** Hiển thị số lượng bùa đang sở hữu (vd: `🛡️ 1/2 Bùa`). Có nút *"Mua thêm bùa (200 XP)"* để phòng ngừa trường hợp đi du lịch hoặc mất mạng.

---

### 3.3. Chỉ số Điểm kinh nghiệm (⭐ XP / Gems Counter)
* **Giao diện:** Ngôi sao vàng óng 3D + Số điểm tích lũy (vd: `⭐ 1.250 XP`).
* **Cách hoạt động:** 
  * Khi hoàn thành một câu hỏi đúng, số điểm sẽ nhảy animation tăng dần (+10 XP) rất nịnh mắt.
* **Popup khi click vào:**
  * Hiển thị biểu đồ XP kiếm được trong 7 ngày qua.
  * Mục tiêu XP trong ngày (Daily Goal): ví dụ `30 / 50 XP (Đạt 60%)`.

---

### 3.4. Chỉ số Mạng sống (❤️ Hearts / Lives Counter)
* **Giao diện:** Icon trái tim màu đỏ 3D + Số tim hiện có (vd: `❤️ 4/5` hoặc `❤️ Vô hạn` đối với Mimo Pro).
* **Popup chi tiết khi click vào (Heart Recovery Modal):**
  * Nếu tim < 5: Hiển thị đồng hồ đếm ngược: *"Hồi 1 tim tiếp theo sau: 03:45:12"*.
  * **Lựa chọn 1 — Miễn phí (Chế độ Ôn tập):** Bấm nút *"Luyện tập để kiếm tim"*. Hệ thống sẽ đưa vào phòng ôn các câu hỏi cũ, làm đúng 3 câu được hồi ngay 1 tim.
  * **Lựa chọn 2 — Mua bằng XP:** Nút *"Hồi đầy 5 tim (150 XP)"*.
  * **Lựa chọn 3 — Nâng cấp Mimo Pro:** Nút *"Vô hạn tim — Học không gián đoạn"*.

---

### 3.5. Chuông Thông báo (🔔 Notification Center)
* **Giao diện:** Icon chuông dập nổi kèm chấm đỏ khi có tin mới.
* **Nội dung thông báo:**
  * Nhắc nhở Streak: *"Đã 20:00 rồi! Vào làm 1 bài 2 phút để không đứt chuỗi 7 ngày nhé!"*.
  * Cạnh tranh giải đấu: *"Nam vừa vượt mặt bạn trên Bảng xếp hạng Vàng! Hãy lấy lại vị trí!"*.
  * Nhiệm vụ lớp học: *"Cô giáo Mai vừa giao bài tập: Thoát hiểm nhà cao tầng. Hạn chót: Chủ nhật"*.

---

## 4. CỘT TIỆN ÍCH BÊN PHẢI (RIGHT WIDGETS SIDEBAR)

Cột bên phải có chiều rộng `340px`, đóng vai trò là **trung tâm kích thích động lực (Motivation Center)** giúp người học luôn có mục tiêu phấn đấu.

### 4.1. Widget 1: Thẻ Nâng cấp "MIMO PRO" (Super Mimo Banner)
* **Thiết kế:** Card gradient óng ánh phong cách holographic/neon sang trọng.
* **Nội dung:** 
  * Biểu tượng Robot Mimo mạ vàng 🤖✨.
  * Dòng chữ: *"Mở khóa tiềm năng an toàn tối đa"*.
  * Danh sách quyền lợi: Vô hạn tim ❤️, Không quảng cáo, Báo cáo rủi ro chi tiết.
  * Nút bấm 3D: *"DÙNG THỬ 7 NGÀY MIỄN PHÍ"*.

### 4.2. Widget 2: Thu nhỏ Bảng xếp hạng Tuần (Leaderboard Preview)
* **Thiết kế:** Card bo tròn viền xám tinh tế.
* **Nội dung:**
  * Tiêu đề: `🏆 GIẢI ĐẤU VÀNG` kèm đồng hồ đếm ngược: *"Còn 2 ngày 14 giờ"*.
  * Hiển thị lát cắt 3 người xung quanh vị trí của user:
    * `#3. Hoàng Anh - 1.320 XP`
    * `#4. Bạn (Nam) - 1.250 XP` *(Tô nền vàng nổi bật)*
    * `#5. Minh Trang - 1.180 XP`
  * Dòng trạng thái khích lệ: *"Chỉ cần thêm 70 XP nữa để lọt vào Top 3 nhận cúp!"*.
  * Nút liên kết: *"Xem toàn bộ bảng đấu ➔"*.

### 4.3. Widget 3: Nhiệm vụ Hàng ngày (Daily Quests Tracker)
* **Thiết kế:** Danh sách 3 thanh tiến độ nhỏ gọn:
  * 🎯 **Nhiệm vụ 1:** Hoàn thành 2 bài học mới `[ 1/2 ]` — Thưởng `+10 XP`.
  * ⚡ **Nhiệm vụ 2:** Đạt 40 XP hôm nay `[ 30/40 XP ]` — Thưởng `+1 Bùa Đóng Băng`.
  * 🎯 **Nhiệm vụ 3:** Đạt 1 bài hoàn hảo (Không mất tim nào) `[ 0/1 ]` — Thưởng `+15 XP`.
* Khi thanh tiến độ đạt 100%, nút *"NHẬN THƯỞNG"* sáng lên kèm hiệu ứng hạt sáng lấp lánh.

### 4.4. Widget 4: Cẩm nang Mẹo sinh tồn trong tuần (Weekly Safety Tip)
* **Thiết kế:** Card màu xanh dương nhạt dịu mắt, có icon bóng đèn `💡`.
* **Nội dung:** Một câu thần chú an toàn ngắn gọn:
  * *"Mẹo tuần này: Khi sạc xe điện, tuyệt đối không cắm sạc qua đêm ở khu vực kín không có người trông coi. Luôn kiểm tra bình cứu hỏa mini trước cửa phòng!"*.

---

## 5. KHU VỰC TRUNG TÂM — BẢN ĐỒ HỌC TẬP (THE SNAKE LEARNING PATH)

Đây là nơi diễn ra 70% tương tác của người học. Lộ trình được thiết kế dưới dạng **con đường uốn lượn (Stepping Stones Snake Path)**, chia thành các Chặng (Units) từ dễ đến khó.

```
                  [ BANNER CHẶNG 1: XỬ LÝ VẾT THƯƠNG & BỎNG ]
                             (Tiến độ: 2/4 Bài)
                                     │
                                    (●)  Nút 1.1: Bỏng nước sôi (Đã xong ★★★)
                                  ／
           Nút 1.2: Vết cắt sâu (●) ◄── [Robot Mimo đứng đây: "Bắt đầu nào!"]
                                  ＼
                                    (🎁) Nút Rương quà may mắn
                                  ／
           Nút 1.3: Sơ cứu gãy xương (○) (Đang khóa 🔒)
                                  ＼
                                    (👑) NÚT TRẠM BOSS CHẶNG 1 (Đang khóa 🔒)
```

### 5.1. Khối Tiêu đề Chặng (Unit Banner Header)
* **Thiết kế:** Khối Card hình chữ nhật trải ngang toàn bộ cột giữa, màu sắc rực rỡ theo chủ đề chặng (vd: Chặng Sơ cứu màu xanh lá, Chặng Cháy nổ màu cam).
* **Nội dung:**
  * Nhãn: `CHẶNG 1`
  * Tiêu đề lớn: `XỬ LÝ VẾT THƯƠNG & BỎNG SINH HOẠT`
  * Mô tả: `Nắm vững nguyên tắc 3 Không khi bị bỏng và cách băng bó vết thương hở đúng chuẩn y khoa.`
  * Nút phụ: `📖 Đọc tóm tắt lý thuyết chặng` (Dành cho người muốn đọc nhanh tài liệu trước khi chơi).

---

### 5.2. Các Trạng thái của Nút Bài học (Stepping Stone Nodes)
Mỗi nút bài học là một khối tròn đường kính `70px`, viền 3D nổi khối chân thực:

| Trạng thái Nút | Hình ảnh hiển thị | Hành vi tương tác |
| :--- | :--- | :--- |
| **1. Đã hoàn thành (Completed)** | Nút màu vàng Gold hoặc Xanh lá rực rỡ. Phía trên có **3 ngôi sao vàng** biểu thị mức độ xuất sắc. | Bấm vào hiển thị popup: Cho phép **"Luyện tập lại (+5 XP)"** để ôn bài cũ. |
| **2. Đang học (Current Active)** | Nút nhấp nháy ánh hào quang nhẹ (Pulse animation). Có **Linh vật Robot Mimo 🤖 đứng cạnh** giơ tay chỉ vào nút kèm bóng thoại: *"Làm bài này nhé!"*. | Bấm vào mở Tooltip xem tóm tắt ➔ Nút to 3D màu xanh lá: **"BẮT ĐẦU (+15 XP)"**. |
| **3. Bị khóa (Locked)** | Nút màu xám trắng nhạt, có biểu tượng chiếc ổ khóa nhỏ `🔒`. | Bấm vào rung nhẹ kèm thông báo: *"Hãy hoàn thành bài trước để mở khóa bài này nhé!"*. |

---

### 5.3. Hộp thoại Tóm tắt Bài học (Lesson Preview Tooltip)
Khi người học click vào bất kỳ Nút bài học nào đang mở, một hộp thoại nhỏ xinh xắn sẽ bật lên ngay phía trên nút:
* **Tên bài học:** Ví dụ: *"Bài 2: Bỏng nước sôi cấp độ 1 & 2"*.
* **Thông số bài:**
  * ⏱️ Thời lượng ước tính: `~2 phút`.
  * ❓ Số tình huống cần xử lý: `4 tình huống`.
  * ⭐ Phần thưởng: `+15 XP` & `Giữ vững chuỗi Streak 🔥`.
* **Nút bấm hành động 3D:** Nút màu xanh lá to bản: **"BẮT ĐẦU"** (Nhấn phím `Enter` hoặc Click để vào chơi ngay).

---

### 5.4. Các Nút Đặc biệt trên Đường đi
* **Nút Rương báu (Gift Chest Node):** Nằm giữa các bài học. Khi học qua nút này, rương sẽ bung nắp nổ pháo hoa hạt vàng, ngẫu nhiên tặng: `+20 XP`, `+1 Bùa đóng băng`, hoặc `15 phút nhân đôi XP (2x XP Boost)`.
* **Nút Trạm Boss cuối chặng (Unit Boss Review):** Nút hình chiếc khiên lớn hoặc vương miện 👑. Đây là bài kiểm tra tổng hợp toàn bộ tình huống của chặng dưới áp lực thời gian. Vượt qua Boss sẽ chính thức hoàn thành chặng và cấp **Huy hiệu Chuyên đề**.

---

## 6. MÀN HÌNH CHƠI TÌNH HUỐNG (SCENARIO GAME ENGINE - ZEN MODE)

Khi người học nhấn **"BẮT ĐẦU"**, toàn bộ giao diện thông thường (Sidebar, Widgets) biến mất hoàn toàn. Màn hình chuyển sang chế độ tập trung tuyệt đối (Zen Mode).

### 6.1. Thanh Header Điều hướng Bài học
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [✕ Thoát]       ██████████████████░░░░░░░░░░ (60%)                      ❤️ ❤️ ❤️ ❤️ 🤍  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
* **Nút Thoát [✕]:** Nằm góc trái. Bấm vào sẽ hiện cảnh báo: *"Bạn có chắc muốn thoát? Tiến độ bài học này sẽ không được lưu và bạn sẽ chưa giữ được Streak hôm nay đâu!"*.
* **Thanh Tiến độ Bài học (Progress Bar):** Nằm chính giữa, bo tròn `pill`. Mỗi khi giải quyết xong 1 câu, vạch xanh lá sẽ chạy animation lướt mượt mà về phía trước.
* **Bộ đếm Tim ❤️:** Nằm góc phải. Khi trả lời sai, 1 quả tim sẽ vỡ ra biến mất kèm hiệu ứng rung.

---

### 6.2. Khu vực Trình bày Tình huống (Scenario Stage)
Nằm ở trung tâm màn hình, chia làm 2 phần: **Ngữ cảnh** và **Câu hỏi**:
1. **Thẻ Ngữ cảnh (Scenario Card):**
   * Robot Mimo dẫn dắt bằng lời thoại thực tế: *"Bạn đang nấu ăn trong bếp thì dầu ăn trong chảo bất ngờ bùng cháy dữ dội!"*.
   * **Hình ảnh/GIF mô phỏng:** Ảnh minh họa chảo lửa đang bốc khói đen chân thực để kích hoạt cảm giác khẩn cấp.
2. **Tiêu đề Câu hỏi:** Dòng chữ in đậm to rõ: *"HÀNH ĐỘNG ĐẦU TIÊN BẠN NÊN LÀM LÀ GÌ?"*.

---

### 6.3. Bốn Dạng Tương tác Thực chiến (Interactive Exercise Types)

#### Dạng 1: Quyết định Tình huống (Scenario Choice)
* Hiển thị 3–4 thẻ lựa chọn hành động to bản, có phím tắt `[1]`, `[2]`, `[3]`:
  * `[ 1 ] Tạt ngay một xô nước lạnh vào chảo dầu` *(Sai lầm kinh điển)*
  * `[ 2 ] Dùng nắp vung kim loại đậy kín chảo và tắt bếp` *(Chính xác)*
  * `[ 3 ] Bê chảo dầu đang cháy chạy nhanh ra ban công` *(Cực kỳ nguy hiểm)*
* Người học bấm chuột hoặc gõ số `1`, `2`, `3` trên bàn phím để chọn.

#### Dạng 2: Sắp xếp Trình tự Cứu hộ (Sequencing Steps)
* Dành cho các quy trình y tế/an toàn đòi hỏi thứ tự nghiêm ngặt (vd: *Sơ cứu hóc dị vật Heimlich*).
* Các thẻ bước hành động nằm lộn xộn. Người học kéo thả (Drag & Drop) hoặc bấm chọn lần lượt để xếp đúng từ bước 1 đến bước 4.

#### Dạng 3: Vạch lá Tìm sâu (Spot the Red Flag)
* Dành cho kỹ năng **Chống lừa đảo mạng (Anti-Scam)**.
* Màn hình hiển thị 1 ảnh chụp tin nhắn SMS biến động số dư hoặc tin nhắn Zalo thông báo trúng thưởng.
* Người học phải dùng ngón tay/chuột chạm đúng vào **điểm bất thường** (vd: tên miền sai chính tả `techcomnbank.com` hoặc yêu cầu cung cấp mã OTP).

#### Dạng 4: Phản xạ Đúng / Sai Thần tốc (Rapid True/False)
* Đưa ra các quan niệm dân gian sai lầm về y tế (vd: *"Bị bỏng bôi kem đánh răng hoặc mỡ trăn ngay là đúng hay sai?"*).
* Người học chỉ có 2 nút to: **ĐÚNG** (Xanh) hoặc **SAI** (Đỏ).

---

### 6.4. Khay Phản hồi dưới Đáy (Bottom Feedback Sheet)
Khay này cố định dưới chân màn hình, có chiều cao khoảng `140px` và sở hữu **3 trạng thái cảm xúc cực mạnh**:

#### Trạng thái ①: Chờ kiểm tra (Idle State)
* Nền màu trắng, đường viền trên xám nhạt `border-top: 2px solid #E2E8F0`.
* Nút bên phải: Mang tên **"KIỂM TRA"**.
  * Khi người học chưa bấm chọn phương án: Nút màu xám nhạt, không bấm được (Disabled).
  * Vừa bấm chọn 1 phương án: Nút lập tức chuyển sang **màu xanh lá 3D sáng rực**, sẵn sàng nhấn phím `Enter`.

#### Trạng thái ②: Trả lời ĐÚNG (Success State)
* Toàn bộ khay đáy trượt vút lên với nền xanh lá pastel (`#DCFCE7`), viền trên xanh lá đậm (`#22C55E`).
* **Âm thanh:** Phát tiếng chuông hợp âm leng keng vui tươi.
* **Nội dung bên trái:**
  * Icon tích xanh tròn to `✅` kèm dòng chữ lớn: **"CHÍNH XÁC! TUYỆT VỜI! (+10 XP)"**.
  * **Giải thích khoa học an toàn:** *"Dầu nhẹ hơn nước nên tạt nước sẽ làm dầu bắn tung tóe gây nổ và phỏng nặng. Đậy nắp vung giúp cách ly oxy làm lửa tự tắt ngay!"*.
* **Nút bên phải:** Chuyển thành nút 3D màu xanh lá rực rỡ: **"TIẾP TỤC ➔ (Enter)"**.

#### Trạng thái ③: Trả lời SAI (Danger / Error State)
* Toàn bộ khay đáy trượt lên với nền đỏ pastel (`#FEE2E2`), viền trên đỏ thẫm (`#EF4444`).
* **Âm thanh & Rung:** Phát tiếng "thud" trầm cảnh báo; điện thoại rung nhẹ 2 nhịp.
* **Hiệu ứng trên đỉnh:** Một quả tim bị nổ vỡ kèm chỉ số `-1 ❤️`.
* **Nội dung bên trái:**
  * Icon tam giác cảnh báo `⚠️` kèm dòng chữ: **"NGUY HIỂM! HÃY CẨN THẬN!"**.
  * Dòng chữ đáp án đúng: *"Đáp án an toàn là: Dùng nắp vung kim loại đậy kín chảo và tắt bếp"*.
  * **Giải thích hậu quả thực tế:** *"Tạt nước vào dầu sôi sẽ tạo ra vụ nổ cầu lửa thiêu rụi toàn bộ gian bếp trong 2 giây!"*.
* **Nút bên phải:** Chuyển thành nút 3D màu đỏ: **"ĐÃ HIỂU (Enter)"**. Câu hỏi này được tự động lưu vào danh sách *"Cần ôn lại"*.

---

### 6.5. Màn hình Tổng kết Hoàn thành Bài học (Lesson Victory Screen)
Khi giải quyết xong câu hỏi cuối cùng:
1. **Hiệu ứng Pháo hoa Confetti:** Hạt giấy nhiều màu nổ tung khắp màn hình.
2. **Linh vật Mimo 🤖:** Nhảy múa ăn mừng, giơ cờ chiến thắng.
3. **Bảng Thống kê Thành tích:**
   * ⭐ **Tổng XP kiếm được:** `+15 XP` (kèm thưởng combo nếu không sai câu nào).
   * 🎯 **Độ chính xác (Accuracy):** `100%` hoặc `75%`.
   * ⏱️ **Thời gian hoàn thành:** `1 phút 45 giây`.
4. **Cập nhật Chuỗi ngày (Streak Animation):**
   * Số ngày Streak nhảy số: từ `6` ➔ bốc cháy thành `🔥 7 NGÀY!`.
   * Thông điệp: *"Tuyệt vời! Bạn đã giữ vững thói quen an toàn hôm nay!"*.
5. Nút bấm 3D to nhất: **"TIẾP TỤC VỀ TRANG CHỦ"**.

---

## 7. MÀN HÌNH BẢNG XẾP HẠNG & GIẢI ĐẤU (LEAGUES SCREEN)

Khi người học bấm vào tab **🏆 Bảng xếp hạng** trên thanh Sidebar:

### 7.1. Hệ thống 5 Hạng Đấu (League Tiers)
1. 🥉 **Giải Đồng (Bronze League):** Điểm khởi đầu của mọi tân binh.
2. 🥈 **Giải Bạc (Silver League)**
3. 🥇 **Giải Vàng (Gold League)**
4. 💎 **Giải Bạch Kim (Platinum League)**
5. 👑 **Giải Kim Cương (Diamond League):** Nơi hội tụ các cao thủ an toàn xuất sắc nhất.

### 7.2. Giao diện Bảng đấu Tuần
* **Thời gian chu kỳ:** Đếm ngược thời gian kết thúc tuần: *"Giải đấu kết thúc sau: 1 ngày 08 giờ"*.
* **Bục Vinh quang Top 3 (Podium):**
  * Vị trí số 1 đứng giữa cao nhất có vương miện mạ vàng, số 2 bên trái và số 3 bên phải.
* **Danh sách bảng xếp hạng 30 người:**
  * Mỗi hàng hiển thị: Thứ hạng, Avatar, Tên người học, Danh hiệu an toàn, và Tổng XP tuần này.
  * **Vạch thăng hạng xanh lá (Top 1–7):** Có nhãn *"Khu vực thăng hạng lên Giải Bạch Kim"*.
  * **Vạch trụ hạng (Hạng 8–24):** Nằm an toàn ở giữa.
  * **Vạch rớt hạng đỏ (Top 25–30):** Có nhãn *"Nguy cơ rớt về Giải Bạc!"*.
  * **Hàng của chính người học:** Được ghim cố định nếu cuộn trang, luôn có nền vàng nổi bật để không bao giờ bị lạc vị trí.

---

## 8. MÀN HÌNH PHÒNG ÔN TẬP & HỒI TIM (PRACTICE ROOM)

Phòng ôn tập là cứu cánh khi người học bị **hết Tim (0/5)** hoặc muốn củng cố kiến thức:

* **Bản chất nghiệp vụ:** Biến thất bại thành bài học. Người học không bao giờ bị "kẹt chết" nếu không nạp tiền, họ luôn có thể dùng sự chăm chỉ để tiếp tục học.
* **Cách thức vận hành:**
  * Hệ thống tự động trích xuất các câu hỏi mà người học **từng chọn sai** trong quá khứ từ cơ sở dữ liệu (`mistakes_bank`).
  * Người học giải lại các câu hỏi này.
  * Cứ mỗi **3 câu trả lời đúng liên tiếp** ➔ Hệ thống lập tức hồi phục **+1 Tim ❤️**.
  * Khi tích đủ 5 tim, người học có thể quay trở lại tiếp tục chinh phục Bản đồ chính.

---

## 9. MÀN HÌNH KHO THÀNH TÍCH & HỒ SƠ CÁ NHÂN (PROFILE & BADGES)

### 9.1. Khối Thông tin Tổng quan (Overview Card)
* **Avatar & Tên người dùng:** Có nút đổi ảnh đại diện hoặc chọn các skin Robot Mimo vui nhộn.
* **Thời gian tham gia:** *"Thành viên từ Tháng 10/2026"*.
* **Chỉ số danh dự:**
  * 🔥 Chuỗi ngày dài nhất từng đạt được: `45 ngày`.
  * ⭐ Tổng XP trọn đời: `8.500 XP`.
  * 👑 Cấp bậc hiện tại: `Cấp 5 — Người bảo vệ (Safety Defender)`.
  * 🚑 Số nạn nhân giả lập đã cứu sống: `38 người`.

### 9.2. Bảo tàng Huy hiệu 3D (Badges Grid)
Hiển thị dạng lưới thẻ huy hiệu rực rỡ:
* 🩹 **Huy hiệu "Bàn tay vàng":** Xử lý hoàn hảo 10 ca bỏng không sai bước nào.
* 🚒 **Huy hiệu "Khắc tinh giặc lửa":** Hoàn thành toàn bộ chuyên đề PCCC chung cư.
* 🛡️ **Huy hiệu "Mắt thần chống Scam":** Vạch mặt chính xác 15 chiêu trò lừa đảo chuyển tiền.
* ⚡ **Huy hiệu "Chiến binh kiên trì":** Đạt chuỗi Streak liên tục 30 ngày.
* Mỗi huy hiệu đều có nút **"Chia sẻ lên Story Facebook / TikTok"** kèm link giới thiệu Mimo để tạo tính lan tỏa tự nhiên (Viral loop).

---

## 10. MÀN HÌNH LỚP HỌC & NHẬP MÃ B2B (MY CLASSROOM)

Đây là tính năng độc đáo giúp kết nối Người học với Nhà trường / Giáo viên:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [ MÀN HÌNH THAM GIA LỚP HỌC ]                                                          │
│                                                                                        │
│   Nhập mã 6 ký tự do Thầy/Cô hoặc Trường cấp:                                         │
│   ┌──────────────────────────────────────────────────────────┐                         │
│   │   [ K ]   [ 1 ]   [ 0 ]   -   [ P ]   [ C ]   [ C ]      │                         │
│   └──────────────────────────────────────────────────────────┘                         │
│                                           [ THAM GIA LỚP HỌC ]                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Trường hợp chưa vào lớp:** Hiện ô nhập mã lớp 6 ký tự (vd: `A1-2026`). Bấm "Tham gia" sẽ tự động liên kết tài khoản với lớp học đó.
* **Trường hợp đã tham gia lớp (Giao diện Lớp học):**
  * Tên trường/lớp: *"Lớp 10A1 — THPT Chuyên Lê Hồng Phong"*.
  * Giáo viên phụ trách: *"Thầy Nguyễn Văn Nam"*.
  * **Mục Bài tập được giao (Assignments):**
    * Tên bài: *"Tuần 2: Kỹ năng xử lý tai nạn giao thông"*
    * Hạn chót: `Còn 2 ngày`
    * Trạng thái: `Chưa hoàn thành [BẮT ĐẦU NGAY]` hoặc `Đã nộp bài (100 điểm) ✅`.
  * **Bảng xếp hạng lớp học:** Xem ai trong lớp đang có điểm XP kỹ năng sống cao nhất để kích thích tinh thần thi đua giữa các bạn học sinh trong cùng lớp.

---

*Tài liệu đặc tả này là kim chỉ nam chi tiết nhất dành cho đội ngũ phát triển Frontend và UI/UX của dự án MIMO. Mọi thành phần đều đã được phân định rõ ràng về vị trí, hình thức và nghiệp vụ hoạt động.*
