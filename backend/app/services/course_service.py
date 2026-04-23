# app/services/course_service.py
from calendar import c

from app.models import Course, Enrollment, CourseProgress, Lesson, Review
from sqlalchemy import asc, desc, func
from app.configs.db import db

class CourseService:
    @staticmethod
    def search_and_sort_courses(page=1, size=10,keyword=None, topic=None, sort_by='id', order='asc', min_price=None, max_price=None, rating=None, has_review=None, is_free=None):

        avg_rating = func.avg(Review.rating).label("avg_rating")
        total_reviews = func.count(func.distinct(Review.review_id)).label("total_reviews")
        query = db.session.query(
            Course,
            avg_rating,
            total_reviews
        ).outerjoin(Review, Course.course_id == Review.course_id)

        query = query.group_by(Course.course_id)
        # 1. Lọc theo từ khóa (Tiêu đề hoặc Mô tả)
        if keyword:
            query = query.filter(
                (Course.title.ilike(f'%{keyword}%')) |
                (Course.description.ilike(f'%{keyword}%'))
            )

        # 2. Lọc theo chủ đề (Dựa trên tiêu đề)
        if topic:
            query = query.filter(Course.title.ilike(f'%{topic}%'))
        # 3. Price range
        if min_price is not None:
            query = query.filter(Course.price >= min_price)

        if max_price is not None:
            query = query.filter(Course.price <= max_price)

        # 4. Free / Pro
        if is_free is True:
            query = query.filter(Course.price == 0)
        elif is_free is False:
            query = query.filter(Course.price > 0)

        having_conditions = []

        if rating is not None:
            having_conditions.append(avg_rating >= rating)

        if has_review:
            having_conditions.append(total_reviews > 0)

        if having_conditions:
            query = query.having(*having_conditions)

        # 6. Sort
        sort_map = {
            'name': Course.title,
            'price': Course.price,
            'id': Course.course_id,
            'rating': avg_rating,
            'reviews': total_reviews
        }

        column = sort_map.get(sort_by, Course.course_id)

        if order == 'desc':
            query = query.order_by(desc(column))
        else:
            query = query.order_by(asc(column))

        total = query.count()
        offset = (page - 1) * size
        courses = query.offset(offset).limit(size).all()

        return {
            "page": page,
            "size": size,
            "total": total,
            "total_pages": (total + size - 1) // size,
            "results": [
                {
                    **course.to_dict(),
                    "avg_rating": round(avg, 1) if avg else 0,
                    "total_reviews": int(count or 0)
                }
                for course, avg, count in courses
            ]
        }

def get_courses_service(page=1, size=10, keyword=None, sort='id'):
    query = db.session.query(
        Course,
        func.avg(Review.rating).label("avg_rating"),
        func.count(Review.review_id).label("total_reviews")
    ).outerjoin(Review, Course.course_id == Review.course_id)
    # Search
    if keyword:
        query = query.filter(Course.title.contains(keyword))
    # Sort
    if hasattr(Course, sort):
        query = query.order_by(getattr(Course, sort))
    # record
    total = query.count()
    courses = query.offset((page - 1) * size).limit(size).all()

    results = []
    for course, avg, count in courses:
        data = course.to_dict()
        data["avg_rating"] = round(avg, 1) if avg else 0
        data["total_reviews"] = count
        results.append(data)

    return {
        "page": page,
        "size": size,
        "total": total,
        "total_pages": (total + size - 1) // size,
        "results": results
    }


def get_course_detail_service(course_id):
    course = Course.query.get(course_id)

    if not course:
        return None

    avg = db.session.query(func.avg(Review.rating)) \
        .filter(Review.course_id == course_id) \
        .scalar()
    count = Review.query.filter_by(course_id=course_id).count()

    return {
        "course_id": course.course_id,
        "title": course.title,
        "description": course.description,
        "price": course.price,
        "image": course.image,

        "avg_rating": round(avg, 1) if avg else 0,
        "total_reviews": count,

        "instructor": course.instructor.name if course.instructor else "Unknown",
        "lessons": [
            {
                "lesson_id": lesson.lesson_id,
                "title": lesson.title,
                "content": lesson.content,
                "video_url": lesson.video_url,
                "documents": [
                    {
                        "document_id": doc.document_id,
                        "file_url": doc.file_url
                    }
                    for doc in lesson.documents
                ]
            }
            for lesson in course.lessons
        ]
    }

def get_course_user(user_id):
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()

    result = []

    for enroll in enrollments:
        course = enroll.course

        progress = CourseProgress.query.filter_by(
            student_id=user_id,
            course_id=course.course_id
        ).first()

        result.append({
            "id": course.course_id,
            "title": course.title,
            "description": course.description,
            "image": course.image,
            "status": progress.status,

            "progress_percent": progress.progress_percent if progress else 0,
            "completed_lessons": progress.completed_lessons if progress else 0,
            "total_lessons": progress.total_lessons if progress else 0,
            "course_status": progress.status if progress else "not_started"
        })

    return result

def enroll_course_service(user_id, course_id):
    existing = Enrollment.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if existing:
        return {"error": "Already enrolled"}, 400

    new_enroll = Enrollment(
        user_id=user_id,
        course_id=course_id,
        status="active"
    )
    db.session.add(new_enroll)

    total_lessons = Lesson.query.filter_by(course_id=course_id).count()

    new_progress = CourseProgress(
        student_id=user_id,
        course_id=course_id,
        total_lessons=total_lessons,
        completed_lessons=0,
        progress_percent=0,
        status="not_started"
    )
    db.session.add(new_progress)

    db.session.commit()

    return {"message": "Enroll success"}, 200