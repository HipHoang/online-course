from flask import Blueprint

course_bp = Blueprint('course_bp', __name__)

@course_bp.route('/', methods=['GET'])
def get_courses():
    return {"message": "List of courses"}