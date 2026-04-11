from app.models.user import User, db
from flask_jwt_extended import create_access_token

def register_user(username, password, name, role):

    if User.query.filter_by(email=username).first():
        return {"message": "User đã tồn tại"}, 400

    new_user = User(email=username, name=name,password=password,role=role)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()
    return {"message": "Đăng ký thành công"}, 201


def login_user(username, password):
    user = User.query.filter_by(email=username).first()
    access_token = create_access_token(identity=str(user.user_id))

    if user and user.check_password(password):
        return {
            "message": "Đăng nhập thành công",
            "access_token": access_token,
            "user": {
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }, 200
    return {"message": "Sai tài khoản hoặc mật khẩu"}, 401