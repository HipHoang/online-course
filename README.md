# 🎓 Online Course Platform

A full-stack online learning platform that allows users to enroll in courses, watch video lessons, complete quizzes, and track their learning progress.

The project is built with **Flask**, **ReactJS**, **MySQL**, and **Cloudinary**, following a RESTful API architecture.

---

## 🚀 Features

* User authentication and authorization
* Course and lesson management
* Student enrollment system
* Video-based learning experience
* Quiz and assessment management
* Learning progress tracking
* Media storage with Cloudinary
* JWT-based authentication
* AI-powered chatbot integration
* Online payment integration

---

## 🛠 Tech Stack

### Backend

* Python Flask
* Flask-SQLAlchemy
* MySQL
* JWT Authentication (Flask-JWT-Extended)
* Cloudinary

### Frontend

* ReactJS
* Axios
* React Router

### Database

* MySQL

---

## 📂 Project Structure

### Backend

```text
backend/
│
├── app/
│   ├── models/        # Database models
│   ├── routes/        # API endpoints
│   ├── services/      # Business logic
│   ├── configs/       # Application configuration
│   └── database/      # Database initialization scripts
│
└── run.py
```

### Frontend

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── routes/
│
└── package.json
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/HipHoang/online-course.git
cd online-course
```

---

### 2. Create a Virtual Environment

Navigate to the backend directory and run:

```bash
# Create virtual environment
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Linux / macOS
source venv/bin/activate
```

---

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

Create a `.env` file and configure:

```env
DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

### 5. Run the Backend Server

```bash
python run.py
```

Backend will start at:

```text
http://localhost:5000
```

---

### 6. Run the Frontend

Navigate to the frontend directory:

```bash
npm install
npm start
```

Frontend will start at:

```text
http://localhost:3000
```

---

## 🔒 Authentication

The system uses JWT (JSON Web Token) for secure authentication and authorization.

Main authentication features:

* User registration
* User login
* Protected API endpoints
* Role-based access control

---

## 📷 Media Storage

Course thumbnails, lesson images, and video content are stored and managed through Cloudinary.

---

## 👨‍💻 Author

**Hoang Minh Hiep**

GitHub: https://github.com/HipHoang
