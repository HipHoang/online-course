from flask import Blueprint, request, jsonify
from app.services.post_service import (create_post, get_posts_by_course,
                                    get_comments_by_post, get_forum_feed,
                                    create_comment,get_post_by_id)
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import success_response, error_response

post_bp  = Blueprint('post_bp', __name__)

@post_bp.route('/courses/<int:course_id>', methods=['POST'])
@jwt_required()
def create_post_api(course_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    content = data.get("content")

    if not content:
        return error_response("Thiếu nội dung", 400)

    result, status = create_post(user_id, course_id, content)

    if "error" in result:
        return error_response(result["error"], status)

    return success_response(result, "Đăng bài thành công")

@post_bp.route('/forum/feed', methods=['GET'])
@jwt_required()
def get_general_forum():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 10, type=int)

    data = get_forum_feed(user_id, page, size)

    return success_response(data, "Lấy danh sách thảo luận thành công")

@post_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_posts(course_id):
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 10, type=int)

    data = get_posts_by_course(course_id, page, size)

    return success_response(data, "Lấy bài viết thành công")


# Mới thêm vào
@post_bp.route('/<int:post_id>', methods=['GET'])
def get_single_post(post_id):
    post = get_post_by_id(post_id)
    if not post: return error_response("Không tìm thấy bài viết", 404)
    return success_response(post)

@post_bp.route('/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def comment_post(post_id):
    user_id = get_jwt_identity()
    data = request.get_json()

    content = data.get("content")

    if not content:
        return error_response("Thiếu nội dung", 400)

    result, status = create_comment(user_id, post_id, content)

    return success_response(result, "Comment thành công")

@post_bp.route('/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    page = request.args.get('page', 1, type=int)
    size = request.args.get('size', 10, type=int)

    data = get_comments_by_post(post_id, page, size)

    return success_response(data, "Lấy comment thành công")