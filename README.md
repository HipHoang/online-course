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

---

## 🏗️ Cấu trúc thư mục

```
online-course/
│
├── be/                 # Flask Backend
│   ├── app/
│   ├── requirements.txt
│   └── run.py
│
├── fe/                 # React Frontend
│   ├── src/
│   └── package.json
│
├── .env.example
└── README.md
```

---

## ⚙️ Cài đặt & chạy project

### 🔹 1. Clone project

```bash
git clone https://github.com/your-username/online-course.git
cd online-course
```

---

### 🔹 2. Backend (Flask)

```bash
cd be
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

👉 Tạo file `.env`:

```
DB_URL=mysql+pymysql://root:password@localhost/online_course
SECRET_KEY=your_secret_key

CLOUD_NAME=your_cloud_name
API_KEY=your_api_key
API_SECRET=your_api_secret
```

👉 Chạy server:

```bash
python run.py
```

📍 Backend chạy tại:

```
http://localhost:5000
```

---

### 🔹 3. Frontend (React)

```bash
cd fe
npm install
npm start
```

📍 Frontend chạy tại:

```
http://localhost:3000
```

---

## 🔗 API Documentation

### 🔐 Authentication

#### ✅ Đăng ký

```
POST /api/auth/register
```

**Body:**

```json
{
  "username": "user1",
  "password": "123456"
}
```

---

#### ✅ Đăng nhập

```
POST /api/auth/login
```

**Response:**

```json
{
  "token": "JWT_TOKEN"
}
```

---

### 👤 User

#### ✅ Lấy thông tin user

```
GET /api/users/me
Authorization: Bearer <token>
```

---

### 📚 Course

#### ✅ Lấy danh sách khóa học

```
GET /api/courses
```

---

#### ✅ Tạo khóa học (Admin)

```
POST /api/courses
Authorization: Bearer <token>
```

---

### 🎬 Lesson

#### ✅ Lấy danh sách bài học theo khóa học

```
GET /api/courses/{course_id}/lessons
```

---

### ☁️ Upload (Cloudinary)

#### ✅ Upload video / ảnh

```
POST /api/upload
```

**Form-data:**

```
file: <file>
```

**Response:**

```json
{
  "url": "https://res.cloudinary.com/..."
}
```

---

### 📝 Enrollment

#### ✅ Đăng ký khóa học

```
POST /api/enroll
Authorization: Bearer <token>
```

---

## 🔄 Luồng hoạt động chính

1. User đăng ký / đăng nhập
2. Xem danh sách khóa học
3. Đăng ký khóa học
4. Xem bài học (video từ Cloudinary)

---

## 🔐 Bảo mật

* Sử dụng JWT Authentication
* Không lưu thông tin nhạy cảm trong code
* Dùng `.env` để quản lý config

---

## 📸 Demo (có thể thêm sau)

* Trang Home
* Trang Course Detail
* Trang Video Player

---

## 👨‍💻 Thành viên nhóm

* Nguyễn Văn A – Backend
* Trần Văn B – Frontend
* ...

---

## 🚀 Hướng phát triển

* Thanh toán online
* Bình luận khóa học
* Theo dõi tiến độ học
* Admin dashboard

---

## 📄 License

Dự án phục vụ mục đích học tập.
