import API from "./authService";
import { storageService } from "./storageService";

/**
 * API thanh toán (Order PENDING → complete → ghi danh server).
 */
export const paymentApi = {
  async createOrder(courseId) {
    const res = await API.post("/payment/orders", {
      course_id: courseId,
    });
    const body = res.data;
    if (body?.status === "error") {
      throw Object.assign(new Error(body.message || "Lỗi tạo đơn"), {
        response: { data: body },
      });
    }
    return body?.data ?? body;
  },

  async completeOrder(orderId, paymentMethod) {
    const res = await API.post(`/payment/orders/${orderId}/complete`, {
      payment_method: paymentMethod,
    });
    const body = res.data;
    if (body?.status === "error") {
      throw Object.assign(new Error(body.message || "Lỗi thanh toán"), {
        response: { data: body },
      });
    }
    return body?.data ?? body;
  },
};

const KEY = "payments";

/** @deprecated Giữ để tương thích; luồng mới dùng paymentApi */
export const paymentService = {
  createPayment(payload) {
    const payment = {
      id: Date.now(),
      ...payload,
      status: "success",
      createdAt: new Date().toISOString(),
    };

    storageService.addUserItem(KEY, payment);
    return payment;
  },

  getMyPayments() {
    return storageService.getUserData(KEY);
  },

  hasPaidCourse(courseId) {
    const myPayments = storageService.getUserData(KEY);
    return myPayments.some(
      (item) =>
        Number(item.courseId) === Number(courseId) && item.status === "success"
    );
  },
};
