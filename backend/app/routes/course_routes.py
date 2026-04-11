# app/routes/course_routes.py
from flask import Blueprint, request
from app.services.course_service import CourseService
from app.utils.response import success_response, error_response

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