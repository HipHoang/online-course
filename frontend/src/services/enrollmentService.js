import API from "./authService";

export const enrollmentService = {
  // ✅ Lấy danh sách khóa học đã đăng ký
  async getMyCourses() {
  try {
    const res = await API.get("/courses/my-courses");

    console.log("RAW MY COURSES:", res.data);

    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("getMyCourses lỗi:", error.response?.data || error);
    return [];
  }
},

  // ✅ Đăng ký khóa học
  async enrollCourse(courseId) {
    try {
      const res = await API.post("/courses/enroll", {
        course_id: courseId,
      });

      return res.data;
    } catch (error) {
      console.error("enrollCourse lỗi:", error.response?.data || error);
      throw error;
    }
  },

  // ✅ Kiểm tra đã đăng ký chưa
  async isEnrolled(courseId) {
    try {
      const myCourses = await this.getMyCourses();

      return myCourses.some(
        (item) => Number(item.courseId) === Number(courseId)
      );
    } catch (error) {
      console.error("isEnrolled lỗi:", error);
      return false;
    }
  },
};
