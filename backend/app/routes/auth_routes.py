from flask import Blueprint, request
from app.services.auth_service import register_user, login_user, verify_google_token
from app.utils.response import error_response, success_response
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token

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

@auth_bp.route("/google", methods=["POST"])
def login_google():
    data = request.get_json()
    token = data.get("token")

    if not token:
        return error_response("Missing token", 400)

    user, error = verify_google_token(token)

    if error:
        return error_response(error, 401)

    access_token = create_access_token(identity=str(user.user_id))

    return success_response({
        "access_token": access_token,
        "user": {
            "id": user.user_id,
            "name": user.name,
            "email": user.email
        }
    }, "Login Google thành công")

@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()

    new_access_token = create_access_token(identity=user_id)

    return jsonify({
        "access_token": new_access_token
    }), 200
