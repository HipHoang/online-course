from flask import Blueprint, jsonify, request
from app.models import Course
from app.services.course_service import get_courses_service, get_course_detail_service

course_bp = Blueprint('course_bp', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():

    page = request.args.get('page', 1, type=int)
    size = min(request.args.get('size', 10, type=int), 50)

    keyword = request.args.get('q')
    sort = request.args.get('sort', 'id')

    data = get_courses_service(page, size, keyword, sort)

    return jsonify(data), 200

@course_bp.route('/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    data = get_course_detail_service(course_id)

    if not data:
        return jsonify({"message": "Course not found"}), 404

    return jsonify(data), 200