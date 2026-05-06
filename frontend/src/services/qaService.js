import apiClient from "../untils/apiClient"; //[cite: 5]

export const qaService = {
  // Lấy danh sách câu hỏi theo khóa học[cite: 2, 3]
  getCourseQuestions: async (courseId, page = 1, size = 10) => {
    const res = await apiClient.get(`/posts/courses/${courseId}`, {
      params: { page, size }
    });
    return res.data; // Trả về cấu trúc phân trang
  },
  
  getForumFeed: async (page = 1, size = 10) => {
    const res = await apiClient.get(`/posts/forum/feed`, {
      params: { page, size }
    });
    return res.data;
  },

  // Đăng câu hỏi mới (Yêu cầu đã đăng ký khóa học)[cite: 2, 3]
  createQuestion: async (courseId, content) => {
    const res = await apiClient.post(`/posts/courses/${courseId}`, { content });
    return res.data;
  },

  // Lấy danh sách câu trả lời của một câu hỏi[cite: 2, 3]
  getQuestionAnswers: async (postId, page = 1, size = 10) => {
    const res = await apiClient.get(`/posts/${postId}/comments`, {
      params: { page, size }
    });
    return res.data;
  },

  // Gửi câu trả lời mới[cite: 2, 3]
  createAnswer: async (postId, content) => {
    const res = await apiClient.post(`/posts/${postId}/comments`, { content });
    return res.data;
  },
  //[cite: 2, 3]
  getSinglePost: async (postId) => {
    const res = await apiClient.get(`/posts/${postId}`);
    return res.data;
  },
};