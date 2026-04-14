from app.configs.db import db

class Lesson(db.Model):
    __tablename__ = 'lessons'
    lesson_id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.course_id'))
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text)
    video_url = db.Column(db.String(255))

    documents = db.relationship('Document', backref='lessons', lazy=True)