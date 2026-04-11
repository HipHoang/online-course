from flask import Flask
from flask_cors import CORS
# SỬA Ở ĐÂY: Dùng đường dẫn tuyệt đối từ folder 'app'
from app.configs.db import db
from app.configs.settings import Config
import os
def create_app():
    app = Flask(__name__)

    # 1. Load cấu hình từ file settings.py hoặc trực tiếp từ .env
    # Nếu bạn chưa viết settings.py, có thể dùng: app.config.from_prefixed_env()
    app.config.from_object(Config)

    # 2. Cấu hình CORS cho phép React (thường là port 3000) truy cập
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # 3. Khởi tạo Database
    db.init_app(app)

    # 4. Đăng ký các Blueprints (Routes)
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.course_routes import course_bp
    # ... Đăng ký thêm các route khác tương tự

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(course_bp, url_prefix='/api/courses')

    @app.route('/')
    def index():
        return {"message": "Server is running!"}

    return app