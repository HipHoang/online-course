# app/services/course_service.py
from app.models import Course
from sqlalchemy import asc, desc


class CourseService:
    @staticmethod
    def search_and_sort_courses(keyword=None, topic=None, sort_by='id', order='asc'):
        query = Course.query

        # 1. Lọc theo từ khóa (Tiêu đề hoặc Mô tả)
        if keyword:
            query = query.filter(
                (Course.title.ilike(f'%{keyword}%')) |
                (Course.description.ilike(f'%{keyword}%'))
            )

        # 2. Lọc theo chủ đề (Dựa trên tiêu đề)
        if topic:
            query = query.filter(Course.title.ilike(f'%{topic}%'))

        # 3. Xử lý sắp xếp
        sort_map = {
            'name': Course.title,
            'price': Course.price,
            'id': Course.course_id
        }
        column = sort_map.get(sort_by, Course.course_id)

        if order == 'desc':
            query = query.order_by(desc(column))
        else:
            query = query.order_by(asc(column))

        # 4. Thực thi truy vấn
        courses = query.all()

        # Chuyển đổi list object sang list dictionary.
        return [course.to_dict() for course in courses]

def get_courses_service(page=1, size=10, keyword=None, sort='id'):

    query = Course.query
    #Search
    if keyword:
        query = query.filter(Course.title.contains(keyword))
    #Sort
    if hasattr(Course, sort):
        query = query.order_by(getattr(Course, sort))
    #record
    total = query.count()
    #offset
    offset = (page - 1) * size
    #data
    courses = query.offset(offset).limit(size).all()

    return {
        "page": page,
        "size": size,
        "total": total,
        "total_pages": (total + size - 1) // size,
        "results": [c.to_dict() for c in courses]
    }

def get_course_detail_service(course_id):
    course = Course.query.get(course_id)

    if not course:
        return None

    return {
        "course_id": course.course_id,
        "title": course.title,
        "description": course.description,
        "price": course.price,
        "instructor": {
            "id": course.instructor_id,
            "name": course.instructor.name if course.instructor else "Unknown"
        },
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
