from flask import Blueprint, jsonify, request
from app.services.lesson_service import (
    get_lessons_by_course, 
    create_lesson,
    update_lesson,
    delete_lesson,
    get_lesson_by_id,
    complete_lesson
)
from app.services.quiz_service import (
    create_quiz_for_lesson, 
    get_quiz_by_lesson, 
    submit_quiz
)
from app.services.cloudinary_service import upload_lesson_file
from app.services.course_service import get_course_detail_service
from app.models import Course, Lesson
from app.configs.db import db
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from app.utils.response import success_response, error_response

lesson_bp = Blueprint('lesson_bp', __name__, url_prefix='/api/lessons')

# Existing routes
@lesson_bp.route('/<int:lesson_id>/view', methods=['POST'])
def view_lesson(lesson_id):
    data = request.json
    student_id = data.get("student_id")

    if not student_id:
        return {"error": "Missing student_id"}, 400

    result, status = complete_lesson(student_id, lesson_id)
    return result, status

# New routes - Get lessons by course
@lesson_bp.route('/course/<int:course_id>', methods=['GET'])
def get_course_lessons(course_id):
    try:
        lessons = get_lessons_by_course(course_id)
        return success_response(data=lessons)
    except Exception as e:
        return error_response(str(e), 500)

# New route - Get single lesson
@lesson_bp.route('/<int:lesson_id>', methods=['GET'])
def get_lesson(lesson_id):
    try:
        lesson = get_lesson_by_id(lesson_id)
        if not lesson:
            return error_response("Lesson not found", 404)
        return success_response(data=lesson)
    except Exception as e:
        return error_response(str(e), 500)

# New route - Create lesson (teacher only)
@lesson_bp.route('/create', methods=['POST'])
@jwt_required()
def add_lesson():
    try:
        user_id = get_jwt_identity()
        
        data = request.get_json()
        course_id = data.get('course_id')
        
        if not course_id:
            return error_response("Missing course_id", 400)
        
        # Check if user is the course instructor
        course = Course.query.get(course_id)
        if not course:
            return error_response("Course not found", 404)
        
        if course.instructor_id != int(user_id):
            return error_response("Unauthorized - only course instructor can add lessons", 403)
        
        lesson = create_lesson(course_id, data)
        return success_response(data=lesson, message="Lesson created successfully", status_code=201)
    except Exception as e:
        return error_response(str(e), 500)

# New route - Update lesson
@lesson_bp.route('/<int:lesson_id>', methods=['PUT'])
@jwt_required()
def edit_lesson(lesson_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user is the course instructor
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return error_response("Lesson not found", 404)
        
        course = Course.query.get(lesson.course_id)
        if course.instructor_id != int(user_id):
            return error_response("Unauthorized - only course instructor can edit lessons", 403)
        
        data = request.get_json()
        lesson = update_lesson(lesson_id, data)
        
        if not lesson:
            return error_response("Lesson not found", 404)
        
        return success_response(data=lesson, message="Lesson updated successfully")
    except Exception as e:
        return error_response(str(e), 500)

# New route - Delete lesson
@lesson_bp.route('/<int:lesson_id>', methods=['DELETE'])
@jwt_required()
def remove_lesson(lesson_id):
    try:
        user_id = get_jwt_identity()
        
        # Check if user is the course instructor
        lesson = Lesson.query.get(lesson_id)
        if not lesson:
            return error_response("Lesson not found", 404)
        
        course = Course.query.get(lesson.course_id)
        if course.instructor_id != int(user_id):
            return error_response("Unauthorized - only course instructor can delete lessons", 403)
        
        success = delete_lesson(lesson_id)
        if not success:
            return error_response("Lesson not found", 404)
        
        return success_response(message="Lesson deleted successfully")
    except Exception as e:
        return error_response(str(e), 500)

# New Quiz & Upload Routes

@lesson_bp.route('/<string:lesson_id>/upload', methods=['POST'])
@jwt_required()
def upload_to_lesson(lesson_id):
    try:
        file_key = 'video' if 'video' in request.files else 'document'
        
        if file_key not in request.files:
            return error_response("Không tìm thấy file tải lên", 400)

        file = request.files[file_key]
        resource_type = 'video' if file_key == 'video' else 'auto'

        url = upload_lesson_file(file, resource_type=resource_type)

        lesson_data = None
        if lesson_id != "temp" and lesson_id.isdigit():
            data = {file_key + '_url': url}
            lesson_data = update_lesson(int(lesson_id), data)

        return success_response(
            data={'url': url, 'lesson': lesson_data}, 
            message="Tải lên thành công"
        )
    except Exception as e:
        print(f"--- LỖI UPLOAD: {str(e)} ---")
        return error_response(str(e), 500)
    
    

@lesson_bp.route('/<int:lesson_id>/quiz', methods=['POST'])
@jwt_required()
def create_lesson_quiz(lesson_id):
    try:
        user_id = get_jwt_identity()
        lesson = db.session.get(Lesson, lesson_id)
        if not lesson:
            return error_response("Lesson not found", 404)
        
        course = db.session.get(Course, lesson.course_id)
        if course.instructor_id != int(user_id):
            return error_response("Unauthorized", 403)

        data = request.get_json()
        _, msg = create_quiz_for_lesson(lesson_id, data['title'], data['questions'])
        return success_response(message=msg, status_code=201)
    except Exception as e:
        return error_response(str(e), 500)

@lesson_bp.route('/<int:lesson_id>/quiz', methods=['GET'])
@jwt_required(optional=True)
def get_lesson_quiz(lesson_id):
    try:
        quiz = get_quiz_by_lesson(lesson_id)
        if not quiz:
            return error_response("No quiz for this lesson", 404)
        return success_response(data=quiz)
    except Exception as e:
        return error_response(str(e), 500)

@lesson_bp.route('/<int:lesson_id>/quiz/submit', methods=['POST'])
@jwt_required()
def submit_lesson_quiz(lesson_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        lesson = db.session.get(Lesson, lesson_id)
        if not lesson or not lesson.quizzes:
            return error_response("No quiz for this lesson", 404)
        
        # Lấy quiz_id từ list quizzes
        quiz_id = lesson.quizzes[0].quiz_id if isinstance(lesson.quizzes, list) else lesson.quizzes.quiz_id
        
        result = submit_quiz(user_id, quiz_id, data['answers'])
        
        if result and result.get('passed'):
            complete_lesson(user_id, lesson_id)
            
        return success_response(data=result)
    except Exception as e:
        return error_response(str(e), 500)
