from flask import Blueprint, jsonify, request
from app.services.lesson_service import complete_lesson

lesson_bp = Blueprint('lesson_bp', __name__)

@lesson_bp.route('/<int:lesson_id>/view', methods=['POST'])
def view_lesson(lesson_id):
    data = request.json
    student_id = data.get("student_id")

    if not student_id:
        return {"error": "Missing student_id"}, 400

    result, status = complete_lesson(student_id, lesson_id)
    return result, status