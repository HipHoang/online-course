from flask import Blueprint, jsonify, request
from app.services.course_service import CourseService, get_courses_service, get_course_detail_service
from app.utils.response import success_response, error_response
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.configs.db import db

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
def get_my_courses():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({"message": "Missing user_id"}), 400

    enrollments = Enrollment.query.filter_by(user_id=user_id).all()

    courses = []
    for e in enrollments:
        course = Course.query.get(e.course_id)
        if course:
            courses.append({
                "id": course.course_id,
                "title": course.title,
                "description": course.description
            })

    return jsonify(courses), 200
@course_bp.route('/enroll', methods=['POST'])
def enroll_course():
    try:
        data = request.get_json()

        user_id = data.get('user_id')
        course_id = data.get('course_id')

        if not user_id or not course_id:
            return jsonify({"message": "Missing data"}), 400

        # kiểm tra đã đăng ký chưa
        existing = Enrollment.query.filter_by(
            user_id=user_id,
            course_id=course_id
        ).first()

        if existing:
            return jsonify({"message": "Already enrolled"}), 400

        new_enroll = Enrollment(
            user_id=user_id,
            course_id=course_id,
            status="active"
        )

        db.session.add(new_enroll)
        db.session.commit()

        return jsonify({"message": "Enroll success"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500