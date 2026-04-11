from app.models.user import User, db


def register_user(username, password):

    if User.query.filter_by(username=username).first():
        return {"message": "User đã tồn tại"}, 400

    new_user = User(username=username)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()
    return {"message": "Đăng ký thành công"}, 201


def login_user(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):

        return {"message": "Đăng nhập thành công", "token": "fake-jwt-token"}, 200
    return {"message": "Sai tài khoản hoặc mật khẩu"}, 401