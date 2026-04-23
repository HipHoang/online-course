import React, { useState } from "react";
import { FiCreditCard, FiX } from "react-icons/fi";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { paymentApi } from "../../services/paymentService";

const formatPrice = (price) => {
  if (!price || Number(price) === 0) return "Miễn phí";
  return `${Number(price).toLocaleString("vi-VN")} VNĐ`;
};

/**
 * Modal thanh toán: tên khóa học, giá, Thẻ tín dụng / Chuyển khoản.
 * Luồng: tạo Order PENDING → xác nhận → complete (ghi danh server).
 */
const CheckoutModal = ({ open, onClose, course, onSuccess, onError }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!open || !course) return null;

  const handlePay = async () => {
    setLocalError("");
    setSubmitting(true);
    try {
      const created = await paymentApi.createOrder(course.id);
      const orderId = created?.order_id;
      if (!orderId) {
        throw new Error("Không nhận được mã đơn hàng từ máy chủ.");
      }
      await paymentApi.completeOrder(orderId, paymentMethod);
      onSuccess?.({ orderId, paymentMethod });
      onClose?.();
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        "Thanh toán thất bại. Vui lòng thử lại.";
      setLocalError(msg);
      onError?.(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 bg-black/45">
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-neutral-200">
          <div>
            <h2
              id="checkout-title"
              className="text-lg font-semibold text-neutral-900"
            >
              Thanh toán
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              Xác nhận đơn hàng và phương thức thanh toán
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
            aria-label="Đóng"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
              Khóa học
            </p>
            <p className="text-base font-semibold text-neutral-900 mt-1 leading-snug">
              {course.title}
            </p>
          </div>

          <div className="flex items-center justify-between py-3 border-y border-neutral-100">
            <span className="text-sm text-neutral-600">Tổng thanh toán</span>
            <span className="text-xl font-bold text-[#002B5B] tabular-nums">
              {formatPrice(course.price)}
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
              Phương thức thanh toán
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("credit_card")}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  paymentMethod === "credit_card"
                    ? "border-[#002B5B] bg-blue-50/50"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                <FiCreditCard className="w-5 h-5 text-[#002B5B] shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900">
                    Thẻ tín dụng
                  </div>
                  <div className="text-xs text-neutral-500">
                    Thanh toán qua thẻ (mô phỏng xác nhận)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("bank_transfer")}
                className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  paymentMethod === "bank_transfer"
                    ? "border-[#002B5B] bg-blue-50/50"
                    : "border-neutral-200 bg-white hover:bg-neutral-50"
                }`}
              >
                <HiOutlineBuildingLibrary className="w-5 h-5 text-[#002B5B] shrink-0" />
                <div>
                  <div className="font-medium text-neutral-900">
                    Chuyển khoản
                  </div>
                  <div className="text-xs text-neutral-500">
                    Chuyển khoản ngân hàng (mô phỏng xác nhận)
                  </div>
                </div>
              </button>
            </div>
          </div>

          {localError ? (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {localError}
            </p>
          ) : null}

          <button
            type="button"
            disabled={submitting}
            onClick={handlePay}
            className="w-full rounded-xl bg-[#002B5B] text-white py-3 font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {submitting ? "Đang xử lý…" : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
