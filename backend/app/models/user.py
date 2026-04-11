from app.configs.db import db
from datetime import datetime


class User(db.Model):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='student')

    # Relationships
    enrollments = db.relationship('Enrollment', backref='user', lazy=True)
    posts = db.relationship('Post', backref='author', lazy=True)