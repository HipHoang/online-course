from flask import Blueprint, request
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth_bp', __name__)

# =========================
# REGISTER
# =========================
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        username = data.get("email")
        password = data.get("password")
        name = data.get("name")
        role = data.get("role", "student")

        result, status = register_user(username, password, name, role)

        return result, status  # ✅ đúng

    except Exception as e:
        return {"message": str(e)}, 500


# =========================
# LOGIN
# =========================
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        username = data.get("email")
        password = data.get("password")

        result, status = login_user(username, password)

        return result, status  # ✅ đúng

    except Exception as e:
        return {"message": str(e)}, 500