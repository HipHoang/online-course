# app/models/course.py
from app.configs.db import db

class Course(db.Model):
    __tablename__ = 'courses'
    course_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    image = db.Column(db.String(255))
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))

    # Kết nối với bảng User
    instructor = db.relationship('User', backref='courses')
    # Kết nối với bảng Courses
    lessons = db.relationship('Lesson', backref='course', lazy=True)
    def to_dict(self):
        return {
            "course_id": self.course_id,
            "id": self.course_id,   # 🔥 thêm dòng này (QUAN TRỌNG)
            "title": self.title,
            "description": self.description,
            "price": float(self.price or 0),  # 🔥 fix NULL
            "image": self.image,
            "instructor_id": self.instructor_id,
            "instructor": self.instructor.name if self.instructor else "Unknown",  # 🔥 thống nhất key
            "avg_rating": 0
        }

