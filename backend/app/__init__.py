from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from app.configs.db import db
from app.configs.settings import Config
from flask_jwt_extended import JWTManager
from flasgger import Swagger

migrate = Migrate()

def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    migrate.init_app(app, db)
    Swagger(app)
    JWTManager(app)

    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.course_routes import course_bp
    from app.routes.lesson_routes import lesson_bp
    from app.routes.payment_routes import payment_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(course_bp, url_prefix='/api/courses')
    app.register_blueprint(lesson_bp, url_prefix='/api/lessons')
    app.register_blueprint(payment_bp, url_prefix='/api/payments')

    @app.route('/')
    def index():
        return {"message": "Server is running!"}

    return app