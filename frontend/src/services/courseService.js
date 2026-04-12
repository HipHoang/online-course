import { mockCourses } from "../data/courses";

const USE_MOCK = true;
const API_BASE_URL = "http://127.0.0.1:8000/api";

export const courseService = {
  async getAllCourses() {
    if (USE_MOCK) {
      return Promise.resolve(mockCourses);
    }

    const response = await fetch(`${API_BASE_URL}/courses/`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách khóa học");
    }

    return response.json();
  },

  async getCourseById(id) {
    if (USE_MOCK) {
      const course = mockCourses.find((item) => item.id === Number(id));
      if (!course) throw new Error("Không tìm thấy khóa học");
      return Promise.resolve(course);
    }

    const response = await fetch(`${API_BASE_URL}/courses/${id}/`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết khóa học");
    }

    return response.json();
  },
};