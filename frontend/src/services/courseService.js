import apiClient from "../untils/auth";

export const courseService = {
  async getAllCourses() {
    try {
      console.log("CALL API getAllCourses");

      const res = await apiClient.get("/courses/");
      const raw = res.data;

      console.log("RAW RESPONSE:", raw);

      const courses = raw?.data?.results;

      if (!Array.isArray(courses)) {
        throw new Error("Invalid course list format");
      }

      return courses.map((item) => this.normalizeCourse(item));

    } catch (error) {
      console.error("getAllCourses ERROR:", error.response?.data || error);
      return [];
    }
  },

    async createCourse(courseData) {
    try {
      const res = await apiClient.post("/courses/", courseData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data; // Trả về toàn bộ response data
    } catch (error) {
      console.error("createCourse ERROR:", error.response?.data || error);
      throw error; // Ném lỗi để xử lý ở component
    }
  },

  async getCourseById(id) {
    try {
      console.log("CALL API getCourseById:", id);

      const res = await apiClient.get(`/courses/${id}`);
      const raw = res.data;

      console.log("RAW DETAIL:", raw);

      const course = raw?.data;

      if (!course) {
        throw new Error("Course not found");
      }

      return this.normalizeCourse(course);

    } catch (error) {
      console.error("getCourseById ERROR:", error.response?.data || error);
      return null;
    }
  },
  async searchCoursesPaged(params) {
    try {
      const query = new URLSearchParams();

      Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, value);
        }
      });

      const res = await apiClient.get(`/courses/search?${query.toString()}`);

      const raw = res.data?.data;

      return {
        ...raw,
        results: (raw?.results || []).map((item) =>
          this.normalizeCourse(item)
        ),
      };
    } catch (error) {
      console.error("searchCoursesPaged ERROR:", error);
      return { results: [] };
    }
  },

  normalizeCourse(course) {
    return {
      id: course.course_id,
      title: course.title || course.name || "Khóa học chưa có tên",
      description: course.description || "Chưa có mô tả khóa học",
      instructor: course.instructor_name || course.instructor?.name || "Giảng viên",
      category: course.category || "Khác",
      level: course.level || "Cơ bản",
      rating:
      course.avg_rating !== undefined && course.avg_rating !== null
        ? Number(course.avg_rating)
        : 0,
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