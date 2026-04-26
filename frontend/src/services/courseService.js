import { mockCourses } from "../data/mockCourses";
import API from "./authService";

/**
 * Service khóa học
 * Ưu tiên API thật nếu backend có dữ liệu.
 * Nếu API lỗi hoặc DB đang trống thì fallback sang mock data.
 */
export const courseService = {
  async getAllCourses() {
    try {
      const res = await API.get("/courses");
      const data = res.data?.data || res.data || [];

      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => this.normalizeCourse(item));
      }

      return mockCourses;
    } catch (error) {
      console.warn("API getAllCourses lỗi, dùng mock:", error);
      return mockCourses;
    }
  },

  async createCourse() {
    try {
      const res = await API.post("/courses");
      const data = res.data?.data || res.data || [];

      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => this.normalizeCourse(item));
      }

      return mockCourses;
    } catch (error) {
      console.warn("API getAllCourses lỗi, dùng mock:", error);
      return mockCourses;
    }
  },

  async getCourseById(id) {
    try {
      const res = await API.get(`/courses/${id}`);
      const data = res.data?.data || res.data;

      if (data) {
        return this.normalizeCourse(data);
      }

      return (
        mockCourses.find((item) => Number(item.id) === Number(id)) || null
      );
    } catch (error) {
      console.warn("API getCourseById lỗi, dùng mock:", error);
      return (
        mockCourses.find((item) => Number(item.id) === Number(id)) || null
      );
    }
  },

  normalizeCourse(course) {
    return {
      id: course.id || course.course_id,
      title: course.title || course.name || "Khóa học chưa có tên",
      description: course.description || "Chưa có mô tả khóa học",
      instructor: course.instructor || "Giảng viên cập nhật sau",
      category: course.category || "Khác",
      level: course.level || "Cơ bản",
      rating: Number(course.rating || 4.5),
      price: Number(course.price || 0),
      totalChapters:
        Number(course.totalChapters) ||
        Number(course.total_chapters) ||
        course.chapters?.length ||
        0,
      totalLessons:
        Number(course.totalLessons) ||
        Number(course.total_lessons) ||
        course.chapters?.reduce(
          (sum, chapter) => sum + (chapter.lessons?.length || 0),
          0
        ) ||
        0,
      totalDuration: course.totalDuration || course.total_duration || "8 giờ",
      image: course.image || course.thumbnail || "",
      introVideoThumbnail:
        course.introVideoThumbnail || course.thumbnail || course.image || "",
      outcomes: course.outcomes || [
        "Nắm kiến thức nền tảng",
        "Có thể thực hành theo dự án nhỏ",
        "Sẵn sàng học phần nâng cao hơn",
      ],
      chapters: course.chapters || [],
    };
  },
};