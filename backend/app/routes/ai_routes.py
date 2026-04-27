from flask import Blueprint, jsonify, request
from app.services.ai_service import generate_reply
from app.utils.response import success_response, error_response

ai_bp = Blueprint('ai_bp', __name__)

@ai_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message')
        if not message:
            return error_response('Missing message', 400)
        reply = generate_reply(message)
        return success_response(data={'reply': reply})
    except Exception as e:
        return error_response(str(e), 500)
