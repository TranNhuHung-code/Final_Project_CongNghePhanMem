# VN.ITJobs – Nền tảng tuyển dụng IT

Đồ án môn **Công nghệ phần mềm**, Nhóm 06. Website kết nối ứng viên với nhà tuyển dụng trong lĩnh vực công nghệ thông tin.

## Chức năng chính

| Đối tượng | Chức năng |
|---|---|
| Khách | Tìm kiếm/lọc việc làm, xem chi tiết công việc và công ty. |
| Ứng viên | Đăng ký, đăng nhập, cập nhật thông tin cá nhân, nộp CV PDF, xem danh sách đơn ứng tuyển và trạng thái. |
| Nhà tuyển dụng | Đăng ký, đăng nhập, cập nhật thông tin công ty, thêm/sửa/xóa công việc, xem và xử lý CV ứng tuyển (đã xem, duyệt, từ chối, xóa). |

> Chỉ bổ sung chức năng **rút đơn ứng tuyển** vào danh sách trên sau khi API và giao diện được commit và kiểm thử.

## Công nghệ

- Backend: Java 17, Spring Boot, Spring Security JWT, Spring Data JPA / Hibernate, Gradle.
- Frontend: Pug, HTML, CSS, JavaScript.
- Database: MySQL 8.
- Triển khai: Docker, Docker Compose, Nginx và Railway.

## Cấu trúc dự án

```text
Final_Project_CongNghePhanMem/
├── backend/                   # Spring Boot và Gradle
├── frontend/
│   ├── views/pages/           # Pug templates
│   └── assets/                # JS, CSS, hình ảnh
├── compose.yaml               # Nhánh feature/docker-deploy
└── README.md
```

## Chạy local (nhánh `main`)

**Yêu cầu:** JDK 17, MySQL 8, Node.js/npm, IntelliJ IDEA (hoặc IDE Java tương đương), trình duyệt và Live Server.

1. Clone mã nguồn:

   ```bash
   git clone https://github.com/TranNhuHung-code/Final_Project_CongNghePhanMem.git
   cd Final_Project_CongNghePhanMem
   git switch main
   ```

2. Tạo database trên MySQL local:

   ```sql
   CREATE DATABASE IF NOT EXISTS itjobs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Nếu có script SQL kèm bộ bài nộp, nhập vào database thử nghiệm trước khi chạy.

3. Mở thư mục `backend` bằng IntelliJ. Trong **Run → Edit Configurations → Environment variables**, cấu hình:

   ```dotenv
   DB_URL=jdbc:mysql://localhost:3306/itjobs_db
   DB_USERNAME=root
   DB_PASSWORD=<mat_khau_mysql_local>
   JWT_SECRET=<khoa_ngau_nhien_toi_thieu_32_bytes>
   ```

   Chạy `BackendApplication` hoặc trong thư mục `backend` chạy `gradlew.bat bootRun` (Windows) / `./gradlew bootRun` (Linux/macOS). Backend mặc định ở `http://localhost:8080`.

4. Trong thư mục `frontend`:

   ```bash
   npm install
   npm run start
   ```

   `npm run start` biên dịch Pug thành HTML và theo dõi thay đổi. Mở `frontend/index.html` qua Live Server. Với Live Server, cấu hình các lời gọi API hướng đến Backend tại `http://localhost:8080`.

## Chạy bằng Docker (nhánh `feature/docker-deploy`)

1. Chuyển nhánh:

   ```bash
   git switch feature/docker-deploy
   ```

2. Tạo `.env.docker.local` tại thư mục gốc; không commit file này:

   ```dotenv
   MYSQL_ROOT_PASSWORD=<mat_khau_root>
   MYSQL_APP_PASSWORD=<mat_khau_tai_khoan_itjobs_app>
   JWT_SECRET=<khoa_ngau_nhien_toi_thieu_32_bytes>
   ```

   **Chú ý:** Nếu MySQL volume đã có dữ liệu, mật khẩu trong file này phải khớp với tài khoản MySQL hiện có; đổi biến môi trường không tự đổi mật khẩu trong database.

3. Build và chạy:

   ```bash
   docker build -t vnitjobs-backend:dev ./backend
   docker compose --env-file .env.docker.local up -d --build
   ```

   Hiện `compose.yaml` sử dụng `image: vnitjobs-backend:dev` cho Backend (không có `build:`), vì vậy phải **build Backend thủ công** sau khi sửa Java.

4. Truy cập:

   | Dịch vụ | Địa chỉ |
   |---|---|
   | Website qua Nginx | http://localhost:8082 |
   | Backend trực tiếp | http://localhost:8081 |
   | MySQL từ host | `127.0.0.1:3307` |

   Bên trong Docker, Backend kết nối MySQL bằng hostname `db` và cổng `3306`.

5. Kiểm tra và dừng:

   ```bash
   docker compose --env-file .env.docker.local ps
   docker compose --env-file .env.docker.local logs --tail=80 backend
   docker compose --env-file .env.docker.local down
   ```

   Không dùng `docker compose down -v` nếu muốn giữ lại database và file CV trong Docker volumes.

## Triển khai Railway

Nhánh `feature/docker-deploy` được sử dụng để triển khai ba service **Frontend (Nginx)**, **Backend (Spring Boot)** và **MySQL**.

- Frontend phục vụ các trang HTML và proxy `/api/`, `/uploads/` đến Backend.
- Backend sử dụng profile `railway` và các Railway Variables: `SPRING_PROFILES_ACTIVE=railway`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.
- MySQL dùng persistent volume. Đường dẫn truy cập công khai của Frontend có thể thay đổi; xem Railway → Frontend → Networking để lấy domain hiện tại.

## Bảo mật và lưu trữ

- Mật khẩu tài khoản được mã hóa bằng BCrypt; JWT xác thực các yêu cầu cần đăng nhập.
- Không commit mật khẩu database, JWT secret, `.env.docker.local` hoặc CV chứa dữ liệu cá nhân thật.
- CV được lưu trên hệ thống file và có đường dẫn tham chiếu trong database. Docker Volume hỗ trợ giữ file qua các lần tạo lại container, **không thay thế backup**.
- Phiên bản demo có thể còn các hạn chế về quản lý token, sao lưu file CV và kiểm thử tự động.

## Tài liệu nộp bài

Bộ nộp nên đi kèm **báo cáo đồ án**, **source code**, **script SQL tạo cấu trúc và dữ liệu mẫu** cùng README này. Script SQL nên được xuất/kiểm thử từ database tương ứng với phiên bản source cuối cùng.

**Repository:** https://github.com/TranNhuHung-code/Final_Project_CongNghePhanMem
