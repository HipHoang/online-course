from flask import Blueprint, jsonify, request
from app.services.course_service import CourseService, get_courses_service, get_course_detail_service, get_course_user, enroll_course_service
from app.utils.response import success_response, error_response
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.configs.db import db
from flask_jwt_extended import jwt_required, get_jwt_identity

# ✅ Khai báo 1 lần duy nhất
course_bp = Blueprint('course_bp', __name__)


# =========================
# SEARCH COURSE
# =========================
@course_bp.route('/search', methods=['GET'])
def search():
    try:
        keyword = request.args.get('q', '').strip()
        topic = request.args.get('topic', '').strip()
        sort_by = request.args.get('sort_by', 'id')
        order = request.args.get('order', 'asc')

        data = CourseService.search_and_sort_courses(
            keyword=keyword,
            topic=topic,
            sort_by=sort_by,
            order=order
        )

        return success_response(
            data=data,
            message=f"Tìm thấy {len(data)} khóa học"
        )

    except Exception as e:
        return error_response(message=str(e), status_code=500)


# =========================
# GET ALL COURSES
# =========================
@course_bp.route('/', methods=['GET'])
def get_courses():
    page = request.args.get('page', 1, type=int)
    size = min(request.args.get('size', 10, type=int), 50)

    keyword = request.args.get('q')
    sort = request.args.get('sort', 'id')

    data = get_courses_service(page, size, keyword, sort)

    return jsonify(data), 200


# =========================
# GET COURSE DETAIL
# =========================
@course_bp.route('/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    data = get_course_detail_service(course_id)

    if not data:
        return jsonify({"message": "Course not found"}), 404

    return jsonify(data), 200


# =========================
# GET MY COURSES
# =========================
@course_bp.route('/my-courses', methods=['GET'])
@jwt_required()
def get_my_courses():
    user_id = get_jwt_identity()

    data = get_course_user(user_id)

    return jsonify(data), 200

@course_bp.route('/enroll', methods=['POST'])
@jwt_required()
def enroll_course():
    try:
        data = request.get_json()

        user_id = get_jwt_identity()
        course_id = data.get('course_id')

        if not user_id or not course_id:
            return jsonify({"message": "Missing data"}), 400

        result, status = enroll_course_service(user_id, course_id)

        return jsonify(result), status

    except Exception as e:
        return jsonify({"message": str(e)}), 500