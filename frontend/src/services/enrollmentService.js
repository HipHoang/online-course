const ENROLLMENTS_KEY = "userEnrollments";

const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

const getAllEnrollments = () => {
  const data = localStorage.getItem(ENROLLMENTS_KEY);
  return data ? JSON.parse(data) : {};
};

const saveAllEnrollments = (data) => {
  localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(data));
};

export const enrollmentService = {
  getMyCourses() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];

    const all = getAllEnrollments();
    return all[currentUser.id] || [];
  },

  isEnrolled(courseId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;

    const all = getAllEnrollments();
    const myCourses = all[currentUser.id] || [];
    return myCourses.some((item) => item.courseId === Number(courseId));
  },

  enrollCourse(course) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error("USER_NOT_LOGGED_IN");
    }

    const all = getAllEnrollments();
    const myCourses = all[currentUser.id] || [];

    const existed = myCourses.find((item) => item.courseId === course.id);
    if (existed) return existed;

    const enrolledCourse = {
      courseId: course.id,
      title: course.title,
      category: course.category,
      instructor: course.instructor,
      image: course.image,
      shortDescription: course.shortDescription,
      totalLessons: course.totalLessons,
      completedLessons: 0,
      progress: 0,
      currentLessonId: course.chapters?.[0]?.lessons?.[0]?.id || 1,
      enrolledAt: new Date().toISOString(),
      status: "Đang học",
    };

    all[currentUser.id] = [...myCourses, enrolledCourse];
    saveAllEnrollments(all);

    return enrolledCourse;
  },

  updateLessonProgress(courseId, lessonId, completedLessons) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const all = getAllEnrollments();
    const myCourses = all[currentUser.id] || [];

    const updated = myCourses.map((item) => {
      if (item.courseId !== Number(courseId)) return item;

      const total = item.totalLessons || 1;
      const progress = Math.min(
        100,
        Math.round((completedLessons / total) * 100)
      );

      return {
        ...item,
        currentLessonId: lessonId,
        completedLessons,
        progress,
        status: progress === 100 ? "Hoàn thành" : "Đang học",
      };
    });

    all[currentUser.id] = updated;
    saveAllEnrollments(all);
  },
};