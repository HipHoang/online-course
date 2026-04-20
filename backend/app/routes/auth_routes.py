from flask import Blueprint, request
from app.services.auth_service import register_user, login_user

auth_bp = Blueprint('auth_bp', __name__)

# =========================
# REGISTER
# =========================
@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Đăng ký người dùng mới
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          properties:
            email:
              type: string
              example: user@example.com
            password:
              type: string
              example: "123456"
            name:
              type: string
              example: "Nguyen Van A"
            role:
              type: string
              example: "student"
    responses:
      201:
        description: Tạo tài khoản thành công
      400:
        description: Dữ liệu không hợp lệ
    """
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
    """
    Đăng nhập hệ thống
    ---
    tags:
      - Authentication
    parameters:
      - name: body
        in: body
        required: true
        schema:
          properties:
            email:
              type: string
              example: trongtin1292004@gmail.com
            password:
              type: string
              example: "your_password"
    responses:
      200:
        description: Đăng nhập thành công, trả về JWT Token
      401:
        description: Sai email hoặc mật khẩu
    """
    try:
        data = request.get_json()

        username = data.get("email")
        password = data.get("password")

        result, status = login_user(username, password)

        return result, status  # ✅ đúng

    except Exception as e:
        return {"message": str(e)}, 500