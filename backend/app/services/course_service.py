from app.models import Course

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