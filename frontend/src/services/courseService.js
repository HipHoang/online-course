const API_BASE_URL = "http://localhost:5000/api";

const getCourseImage = (course) => {
  const text = `${course.title || ""} ${course.description || ""}`.toLowerCase();

  if (
    text.includes("react native") ||
    text.includes("mobile") ||
    text.includes("android") ||
    text.includes("ios")
  ) {
    return "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("react") ||
    text.includes("frontend") ||
    text.includes("javascript") ||
    text.includes("html") ||
    text.includes("css") ||
    text.includes("web")
  ) {
    return "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("python") ||
    text.includes("backend") ||
    text.includes("flask") ||
    text.includes("django") ||
    text.includes("api")
  ) {
    return "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("sql") ||
    text.includes("database") ||
    text.includes("mysql") ||
    text.includes("postgresql") ||
    text.includes("data")
  ) {
    return "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("ui") ||
    text.includes("ux") ||
    text.includes("design") ||
    text.includes("figma")
  ) {
    return "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("ai") ||
    text.includes("machine learning") ||
    text.includes("deep learning") ||
    text.includes("trí tuệ nhân tạo")
  ) {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("marketing") ||
    text.includes("business") ||
    text.includes("kinh doanh")
  ) {
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop";
  }

  if (
    text.includes("english") ||
    text.includes("toeic") ||
    text.includes("ielts") ||
    text.includes("tiếng anh")
  ) {
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop";
  }

  return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop";
};

const normalizeCourse = (course) => {
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];

  return {
    ...course,
    id: course.id ?? course.course_id,
    instructor:
      typeof course.instructor === "object"
        ? course.instructor?.name
        : course.instructor || course.instructor_name || "Chưa cập nhật",
        category:
        course.category ||
        (() => {
          const text = `${course.title || ""} ${course.description || ""}`.toLowerCase();
      
          if (
            text.includes("python") ||
            text.includes("react") ||
            text.includes("java") ||
            text.includes("c++") ||
            text.includes("node") ||
            text.includes("backend") ||
            text.includes("frontend") ||
            text.includes("lập trình")
          ) {
            return "Lập trình";
          }
      
          if (
            text.includes("marketing") ||
            text.includes("business") ||
            text.includes("kinh doanh")
          ) {
            return "Kinh doanh";
          }
      
          if (
            text.includes("excel") ||
            text.includes("word") ||
            text.includes("powerpoint") ||
            text.includes("tin học văn phòng")
          ) {
            return "Tin học văn phòng";
          }
      
          if (
            text.includes("design") ||
            text.includes("photoshop") ||
            text.includes("figma")
          ) {
            return "Thiết kế";
          }
      
          if (
            text.includes("soft skill") ||
            text.includes("giao tiếp") ||
            text.includes("kỹ năng mềm")
          ) {
            return "Kỹ năng mềm";
          }
      
          if (
            text.includes("data") ||
            text.includes("sql") ||
            text.includes("database")
          ) {
            return "Dữ liệu";
          }
      
          return "Khóa học";
        })(),
    rating: course.rating || 4.8,
    level: course.level || "Cơ bản",
    image: course.image || getCourseImage(course),
    introVideoThumbnail:
      course.introVideoThumbnail || course.image || getCourseImage(course),
    shortDescription: course.shortDescription || course.description || "",
    outcomes: course.outcomes || [],
    totalLessons: course.totalLessons || lessons.length,
    totalChapters: course.totalChapters || 1,
    totalDuration: course.totalDuration || "Chưa cập nhật",
    chapters: course.chapters || [
      {
        id: 1,
        title: "Nội dung khóa học",
        lessonsCount: lessons.length,
        lessons: lessons.map((lesson, index) => ({
          id: lesson.id ?? lesson.lesson_id ?? index + 1,
          lesson_id: lesson.lesson_id ?? lesson.id ?? index + 1,
          title: lesson.title,
          content: lesson.content,
          video_url: lesson.video_url,
          duration: lesson.duration || "Chưa cập nhật",
          documents: lesson.documents || [],
        })),
      },
    ],
  };
};

export const courseService = {
  async getAllCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) {
      throw new Error("Không thể lấy danh sách khóa học");
    }

    const result = await response.json();
    const courses = Array.isArray(result) ? result : result.results || [];
    return courses.map(normalizeCourse);
  },

  async getCourseById(id) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) {
      throw new Error("Không thể lấy chi tiết khóa học");
    }

    const result = await response.json();
    return normalizeCourse(result);
  },

  async searchCourses(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.q?.trim()) searchParams.append("q", params.q.trim());
    if (params.topic?.trim()) searchParams.append("topic", params.topic.trim());
    if (params.sort_by?.trim()) searchParams.append("sort_by", params.sort_by.trim());
    if (params.order?.trim()) searchParams.append("order", params.order.trim());

    const response = await fetch(
      `${API_BASE_URL}/courses/search?${searchParams.toString()}`
    );

    if (!response.ok) {
      throw new Error("Không thể tìm kiếm khóa học");
    }

    const result = await response.json();
    const courses = result.data || [];
    return courses.map(normalizeCourse);
  },
};