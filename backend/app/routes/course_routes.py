from app.services.course_service import CourseService
from app.utils.response import success_response, error_response
from flask import Blueprint, jsonify, request
from app.services.course_service import get_courses_service, get_course_detail_service

course_bp = Blueprint('course_bp', __name__)


@course_bp.route('/search', methods=['GET'])
def search():
    try:
        # Lấy tham số từ URL
        keyword = request.args.get('q', '').strip()
        topic = request.args.get('topic', '').strip()
        sort_by = request.args.get('sort_by', 'id')
        order = request.args.get('order', 'asc')

        # Gọi logic từ Service
        data = CourseService.search_and_sort_courses(
            keyword=keyword,
            topic=topic,
            sort_by=sort_by,
            order=order
        )

        # Trả về kết quả thông qua Util Response
        return success_response(
            data=data,
            message=f"Tìm thấy {len(data)} khóa học"
        )

    except Exception as e:
        return error_response(message=str(e), status_code=500)


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
