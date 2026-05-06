import apiClient from "../untils/apiClient";
import { getCurrentUser } from "../untils/auth";

export const reviewService = {
  // 1. Lấy danh sách đánh giá (Có xử lý phân trang)
  async getCourseReviews(courseId) {
    try {
      const res = await apiClient.get(`/reviews/courses/${courseId}`);
      // Backend trả về: { status: "success", data: { data: [...], total: 10, ... } }
      // Vì vậy chúng ta cần lấy res.data.data.data
      return res.data.data.data || []; 
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  },

  // 2. Lấy đánh giá của tôi
  async getMyReview(courseId) {
    const currentUser = getCurrentUser();
    if (!currentUser) return null;

    const reviews = await this.getCourseReviews(courseId);
    // Bây giờ 'reviews' đã là một mảng, hàm .find() sẽ hoạt động chính xác
    return reviews.find(item => Number(item.user_id) === Number(currentUser.id)) || null;
  },

  // 3. Tính toán thống kê
  async getCourseReviewStats(courseId) {
    const reviews = await this.getCourseReviews(courseId);

    if (!Array.isArray(reviews) || !reviews.length) {
      return { average: 0, total: 0 };
    }

    const totalRating = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return {
      average: Number((totalRating / reviews.length).toFixed(1)),
      total: reviews.length,
    };
  },

  // 4. Gửi đánh giá mới
  async addOrUpdateReview(courseId, payload) {
    const res = await apiClient.post(`/reviews/courses/${courseId}`, {
      rating: payload.rating,
      comment: payload.comment
    });
    return res.data.data;
  }
};