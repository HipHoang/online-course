from datetime import datetime
from app.configs.db import db
from app.models import LessonProgress, Lesson, CourseProgress
from sqlalchemy import func

def complete_lesson(student_id, lesson_id):

    lesson = Lesson.query.get(lesson_id)
    if not lesson:
        return {"error": "Lesson not found"}, 404

    course_id = lesson.course_id

    lp = LessonProgress.query.filter_by(
        student_id=student_id,
        course_id=course_id,
        lesson_id=lesson_id
    ).first()

    if not lp:
        lp = LessonProgress(
            student_id=student_id,
            course_id=course_id,
            lesson_id=lesson_id
        )

    lp.is_completed = True
    lp.completion_percent = 100
    lp.completed_at = datetime.utcnow()
    lp.last_accessed_at = datetime.utcnow()

    db.session.add(lp)
    db.session.commit()

    total_lessons = db.session.query(func.count(Lesson.lesson_id)) \
        .filter(Lesson.course_id == course_id).scalar()

    completed_lessons = db.session.query(func.count(LessonProgress.lesson_id)) \
        .filter(
            LessonProgress.student_id == student_id,
            LessonProgress.course_id == course_id,
            LessonProgress.is_completed == True
        ).scalar()

    progress_percent = (completed_lessons / total_lessons) * 100 if total_lessons > 0 else 0

    cp = CourseProgress.query.filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if not cp:
        cp = CourseProgress(
            student_id=student_id,
            course_id=course_id
        )

    cp.total_lessons = total_lessons
    cp.completed_lessons = completed_lessons
    cp.progress_percent = progress_percent
    cp.last_learned_at = datetime.utcnow()

    if progress_percent == 0:
        cp.status = 'not_started'
    elif progress_percent == 100:
        cp.status = 'completed'
    else:
        cp.status = 'in_progress'

    db.session.add(cp)
    db.session.commit()

    return {
        "message": "Lesson completed",
        "progress_percent": progress_percent
    }, 200