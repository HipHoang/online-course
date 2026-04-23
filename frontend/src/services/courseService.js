import API from "./authService";

/**
 * Service khóa học
 * Chỉ sử dụng API thật để lấy dữ liệu từ SQL.
 */
export const courseService = {
  async getAllCourses() {
    try {
      const res = await API.get("/courses/");

      const payload = res.data?.data || {};

      const list = Array.isArray(payload.results)
        ? payload.results
        : [];

      return list.map((item) => this.normalizeCourse(item));

    } catch (error) {
      console.error("API getAllCourses lỗi:", error);
      throw error;
    }
  }
  ,

  async getCourseById(id) {
    try {
      const res = await API.get(`/courses/${id}`);
      const data = res.data?.data || res.data;

      if (data) {
        return this.normalizeCourse(data);
      }

      return null;
    } catch (error) {
      console.error("API getCourseById lỗi:", error);
      throw error;
    }
  },

  async searchCoursesPaged(params = {}) {
    const searchParamKeys = [
      "q",
      "page",
      "size",
      "topic",
      "min_price",
      "max_price",
      "rating",
      "has_review",
      "is_free",
      "sort_by",
      "order",
    ];

    const query = {};
    for (const key of searchParamKeys) {
      const value = params[key];
      if (value === undefined || value === null || value === "") {
        continue;
      }
      if (key === "has_review" || key === "is_free") {
        query[key] =
          typeof value === "boolean" ? (value ? "true" : "false") : value;
      } else {
        query[key] = value;
      }
    }

    try {
      const res = await API.get("/courses/search", { params: query });
      const payload = res.data?.data ?? res.data;

      if (!payload || typeof payload !== "object") {
        return {
          page: 1,
          size: Number(params.size) || 10,
          total: 0,
          total_pages: 0,
          results: [],
        };
      }

      const rawList = Array.isArray(payload.results) ? payload.results : [];
      const results = rawList.map((item) =>
        this.normalizeCourse({
          ...item,
          id: item.id ?? item.course_id,
          instructor: item.instructor ?? item.instructor_name,
          rating: item.rating ?? item.avg_rating,
        })
      );

      return {
        page: Number(payload.page) || 1,
        size: Number(payload.size) || Number(params.size) || 10,
        total: Number(payload.total) || 0,
        total_pages: Number(payload.total_pages) || 0,
        results,
      };
    } catch (error) {
      console.error("API searchCoursesPaged lỗi:", error);
      throw error;
    }
  },

  normalizeCourse(course) {
    return {
      id: Number(course.id ?? course.course_id),
      title: course.title || course.name || "Khóa học chưa có tên",
      description: course.description || "Chưa có mô tả khóa học",
      instructor: course.instructor || "Giảng viên cập nhật sau",
      category: course.category || "Khác",
      level: course.level || "Cơ bản",
      rating: Number(course.rating ?? course.avg_rating ?? 4.5),
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