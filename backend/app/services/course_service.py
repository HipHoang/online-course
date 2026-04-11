# app/services/course_service.py
from app.models.course import Course
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