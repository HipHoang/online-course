from flask import Blueprint, request, jsonify
from app.services import auth_service

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    result, status = auth_service.register_user(data['email'], data['password'], data['name'],data["role"])
    return jsonify(result), status

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    result, status = auth_service.login_user(data['email'], data['password'])
    return jsonify(result), status