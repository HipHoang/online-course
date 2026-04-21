import { getCurrentUser } from "../untils/auth";

const ENROLLMENTS_KEY = "userEnrollments";

const getAllEnrollments = () => {
  const data = localStorage.getItem(ENROLLMENTS_KEY);
  return data ? JSON.parse(data) : {};
};

const saveAllEnrollments = (data) => {
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(data));
};

const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id || null;
};

export const enrollmentService = {
  getMyCourses() {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const all = getAllEnrollments();
    return all[userId] || [];
  },

  isEnrolled(courseId) {
    const myCourses = this.getMyCourses();
    return myCourses.some((item) => Number(item.courseId) === Number(courseId));
  },

  enrollCourse(course) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("USER_NOT_LOGGED_IN");

    const all = getAllEnrollments();
    const myCourses = all[userId] || [];

    const existed = myCourses.some(
      (item) => Number(item.courseId) === Number(course.id)
    );

    if (existed) return;

    const newEnrollment = {
      courseId: Number(course.id),
      title: course.title,
      image: course.image || "",
      instructor: course.instructor || "",
      progress: 0,
      completedLessons: 0,
      currentLessonId: course.chapters?.[0]?.lessons?.[0]?.id || null,
      enrolledAt: new Date().toISOString(),
      status: "learning",
      paymentMethod: course.paymentMethod || null,
      paidAt: course.paidAt || null,
    };

    all[userId] = [newEnrollment, ...myCourses];
    saveAllEnrollments(all);
  },

  updateLessonProgress(courseId, lessonId, completedLessons) {
    const userId = getCurrentUserId();
    if (!userId) throw new Error("USER_NOT_LOGGED_IN");

    const all = getAllEnrollments();
    const myCourses = all[userId] || [];

    all[userId] = myCourses.map((item) => {
      if (Number(item.courseId) !== Number(courseId)) return item;

      const progress = Math.min(100, completedLessons * 10);

      return {
        ...item,
        currentLessonId: lessonId,
        completedLessons,
        progress,
        status: progress >= 100 ? "completed" : "learning",
      };
    });

    saveAllEnrollments(all);
  },
};