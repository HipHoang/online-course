from flask import jsonify
from app.models.user import User, db
from flask_jwt_extended import create_access_token


def register_user(username, password, name, role):
    if User.query.filter_by(email=username).first():
        return jsonify({"message": "User đã tồn tại"}), 400

    new_user = User(email=username, name=name, role=role)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "Đăng ký thành công",
        "user": {
            "id": new_user.user_id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }), 201


def login_user(username, password):
    user = User.query.filter_by(email=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.user_id))

        return jsonify({
            "message": "Đăng nhập thành công",
            "access_token": access_token,
            "user": {
                "id": user.user_id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }), 200

    return jsonify({"message": "Sai tài khoản hoặc mật khẩu"}), 401