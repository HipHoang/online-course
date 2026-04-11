# 🎓 Online Course Platform

Hệ thống học trực tuyến cho phép người dùng đăng ký khóa học, xem bài giảng (video), và quản lý tiến trình học tập.
Dự án sử dụng **Flask (Backend)**, **ReactJS (Frontend)**, **MySQL**, và **Cloudinary** để lưu trữ media.

---

## 📌 Công nghệ sử dụng

### 🔹 Backend

* Python Flask
* SQLAlchemy (ORM)
* MySQL (MySQL Workbench)
* Cloudinary (upload video/image)
* JWT Authentication

### 🔹 Frontend

* ReactJS
* Axios (call API)
* React Router

# Online Course Platform - Backend (Flask)

Dự án hệ thống quản lý khóa học trực tuyến sử dụng Flask, MySQL và Cloudinary.

## 🛠 Bộ công nghệ (Tech Stack)
- **Backend:** Flask (Python)
- **Database:** MySQL
- **ORM:** Flask-SQLAlchemy
- **Authentication:** JWT (Flask-JWT-Extended)
- **Storage:** Cloudinary (Lưu trữ hình ảnh/video)

## 📁 Cấu trúc thư mục
- `app/models/`: Định nghĩa cấu trúc database.
- `app/routes/`: Xử lý các API endpoints.
- `app/services/`: Logic xử lý nghiệp vụ.
- `app/configs/`: Cấu hình hệ thống và kết nối DB.
- `app/database/`: Các script khởi tạo database.

---

## 🚀 Hướng dẫn cài đặt dành cho cộng tác viên

Khi mới clone code từ GitHub về, các bạn thực hiện theo các bước sau để chạy dự án trên máy cá nhân:

### Bước 1: Khởi tạo môi trường ảo (Virtual Environment)
Mở terminal tại thư mục `backend/` và chạy:
```bash
# Tạo môi trường ảo
python -m venv venv

# Kích hoạt (Windows)
venv\Scripts\activate

# Kích hoạt (Mac/Linux)
source venv/bin/activate
