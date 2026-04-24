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
        page = request.args.get('page', 1, type=int)
        size = min(request.args.get('size', 10, type=int), 50)
        keyword = request.args.get('q', '').strip()
        topic = request.args.get('topic', '').strip()
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        rating = request.args.get('rating', type=float)
        has_review = request.args.get('has_review')
        is_free = request.args.get('is_free')
        has_review = True if has_review == 'true' else False if has_review == 'false' else None
        is_free = True if is_free == 'true' else False if is_free == 'false' else None
        sort_by = request.args.get('sort_by', 'id')
        order = request.args.get('order', 'asc')

        data = CourseService.search_and_sort_courses(
            page=page,
            size=size,
            keyword=keyword,
            topic=topic,
            sort_by=sort_by,
            order=order,
            min_price=min_price,
            max_price=max_price,
            rating=rating,
            has_review=has_review,
            is_free=is_free
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
    try:
        page = request.args.get('page', 1, type=int)
        size = min(request.args.get('size', 10, type=int), 50)

        keyword = request.args.get('q')
        topic = request.args.get('topic')
        sort_by = request.args.get('sort_by', 'id')
        order = request.args.get('order', 'asc')

        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        rating = request.args.get('rating', type=float)

        is_free = request.args.get('is_free')
        if is_free is not None:
            is_free = is_free.lower() == 'true'

        has_review = request.args.get('has_review')
        if has_review is not None:
            has_review = has_review.lower() == 'true'

        data = CourseService.search_and_sort_courses(
            page=page,
            size=size,
            keyword=keyword,
            topic=topic,
            sort_by=sort_by,
            order=order,
            min_price=min_price,
            max_price=max_price,
            rating=rating,
            has_review=has_review,
            is_free=is_free
        )

        return success_response(data,"Lấy danh sách khóa học thành công",200)

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# =========================
# GET COURSE DETAIL
# =========================
@course_bp.route('/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    data = get_course_detail_service(course_id)

    if not data:
        return jsonify({"message": "Course not found"}), 404

    return success_response(data=data,message="Lấy chi tiết khóa học thành công",status_code=200)


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