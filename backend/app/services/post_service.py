from app.models import Post, Enrollment, Comment
from app.configs.db import db
from sqlalchemy import desc


def create_post(user_id, course_id, content):

    enrollment = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if not enrollment:
        return {"error": "Bạn chưa đăng ký khóa học"}, 403

    post = Post(
        user_id=user_id,
        course_id=course_id,
        content=content
    )

    db.session.add(post)
    db.session.commit()

    return {
        "message": "Đăng bài thành công",
        "post_id": post.post_id
    }, 201

def get_posts_by_course(course_id, page=1, size=10):
    query = Post.query.filter_by(course_id=course_id)

    total = query.count()

    posts = query.order_by(desc(Post.created_at))\
        .offset((page - 1) * size)\
        .limit(size)\
        .all()

    data = [
        {
            "post_id": p.post_id,
            "content": p.content,
            "created_at": p.created_at,
            "user": {
                "id": p.user_id,
                "name": p.user.name if p.user else "Unknown"
            }
        }
        for p in posts
    ]

    return {
        "page": page,
        "size": size,
        "total": total,
        "total_pages": (total + size - 1) // size,
        "data": data
    }

# post_service.py

def get_forum_feed(user_id, page=1, size=10):
    try:
        # 1. Lấy danh sách khóa học active
        active_enrollments = Enrollment.query.filter_by(
            user_id=user_id, 
            status='active'
        ).all()
        
        course_ids = [e.course_id for e in active_enrollments]

        # Nếu sinh viên chưa có khóa học nào active, trả về danh sách rỗng thay vì lỗi
        if not course_ids:
            return {
                "page": page, "size": size, "total": 0, "total_pages": 0, "data": []
            }

        # 2. Truy vấn bài viết
        query = Post.query.filter(Post.course_id.in_(course_ids))
        total = query.count()

        # Sắp xếp bài mới nhất lên đầu (thường dùng desc cho diễn đàn)
        posts = query.order_by(desc(Post.created_at))\
            .offset((page - 1) * size)\
            .limit(size)\
            .all()

        data = []
        for p in posts:
            # Kiểm tra an toàn trước khi truy cập relationship
            user_info = {
                "id": p.user_id,
                "name": p.author.name if p.author else "Học viên"
            }
            
            data.append({
                "post_id": p.post_id,
                "title": getattr(p, 'title', p.content[:50]), # Nếu không có title thì lấy tạm content
                "content": p.content,
                "created_at": p.created_at.isoformat() if p.created_at else None, # Quan trọng: Format ngày tháng
                "course_name": p.course.title if p.course else "Khóa học",
                "user": user_info,
                "stats": {
                    "comments": len(p.comments) if hasattr(p, 'comments') else 0
                }
            })

        return {
            "page": page,
            "size": size,
            "total": total,
            "total_pages": (total + size - 1) // size,
            "data": data
        }
    except Exception as e:
        print(f"Lỗi logic Feed: {str(e)}") # Log lỗi ra terminal để debug
        return {"error": "Lỗi máy chủ nội bộ"}, 500

# API "Lấy chi tiết câu hỏi" ở Backend
def get_post_by_id(post_id):
    post = Post.query.get(post_id)
    if not post:
        return None
    
    return {
        "post_id": post.post_id,
        "content": post.content,
        "created_at": post.created_at,
        "user": {
            "id": post.user_id,
            "name": post.user.name if post.user else "Unknown"
        }
    }

def create_comment(user_id, post_id, content):
    comment = Comment(
        user_id=user_id,
        post_id=post_id,
        content=content
    )

    db.session.add(comment)
    db.session.commit()

    return {"message": "Comment thành công"}, 201

def get_comments_by_post(post_id, page=1, size=10):
    query = Comment.query.filter_by(post_id=post_id)

    total = query.count()

    comments = query.order_by(Comment.created_at.desc()) \
        .offset((page - 1) * size) \
        .limit(size) \
        .all()

    data = [
        {
            "comment_id": c.comment_id,
            "content": c.content,
            "created_at": c.created_at,
            "user": {
                "id": c.user_id,
                "name": c.user.name if c.user else "Unknown"
            }
        }
        for c in comments
    ]

    return {
        "page": page,
        "size": size,
        "total": total,
        "total_pages": (total + size - 1) // size,
        "data": data
    }