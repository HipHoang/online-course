import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiLock,
  FiMonitor,
  FiPlayCircle,
  FiSmartphone,
  FiStar,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";

const formatPrice = (price) => {
  if (!price || Number(price) === 0) return "Miễn phí";
  return `${Number(price).toLocaleString("vi-VN")}VNĐ`;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChapters, setOpenChapters] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: "",
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourseById(id);
        setCourse(data);
        setIsEnrolled(enrollmentService.isEnrolled(id));

        const initialState = {};
        data.chapters?.forEach((chapter, index) => {
          initialState[chapter.id] = index === 0;
        });
        setOpenChapters(initialState);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    setPaymentForm((prev) => ({
      ...prev,
      fullName: currentUser.fullName || "",
      email: currentUser.email || "",
    }));
  }, []);

  const isFreeCourse = useMemo(() => Number(course?.price || 0) === 0, [course]);

  const toggleChapter = (chapterId) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleRequireAuth = (type = "login", message = "") => {
    window.dispatchEvent(
      new CustomEvent("openAuthModal", {
        detail: { type, message },
      })
    );
  };

  const enrollFreeCourse = () => {
    try {
      enrollmentService.enrollCourse(course);
      setIsEnrolled(true);
      alert("Đăng ký khóa học thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đăng ký khóa học.");
    }
  };

  const handleEnrollCourse = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      handleRequireAuth("login", "Bạn cần đăng nhập để đăng ký khóa học này.");
      return;
    }

    if (isEnrolled) {
      navigate(`/learn/${course.id}`);
      return;
    }

    if (isFreeCourse) {
      enrollFreeCourse();
      return;
    }

    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentForm.fullName.trim() || !paymentForm.phone.trim() || !paymentForm.email.trim()) {
      alert("Vui lòng nhập đầy đủ họ tên, số điện thoại và email.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      alert("Bạn cần đăng nhập");
      return;
    }

    setIsProcessingPayment(true);

try {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (paymentMethod === "vnpay") {
    const res = await fetch("http://127.0.0.1:5000/api/payment/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: currentUser.user_id,
        course_id: course.id,
        amount: course.price,
      }),
    });

    const data = await res.json();

    if (!data.payment_url) {
      throw new Error("Không lấy được link VNPay");
    }

    window.location.href = data.payment_url;
    return;
  }

  // 🟡 Mock cho MoMo / Card
  await new Promise((resolve) => setTimeout(resolve, 1000));

  enrollmentService.enrollCourse({
    ...course,
    paymentMethod,
    paidAt: new Date().toISOString(),
  });

  alert("Thanh toán thành công!");
  navigate(`/learn/${course.id}`);

} catch (error) {
  console.error(error);
  alert("Không thể tạo thanh toán");
} finally {
  setIsProcessingPayment(false);
}
  };

  const handleLearnNow = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      handleRequireAuth("login", "Bạn cần đăng nhập để học khóa học này.");
      return;
    }

    if (!isEnrolled) {
      if (isFreeCourse) {
        enrollFreeCourse();
        navigate(`/learn/${course.id}`);
      } else {
        setShowPaymentModal(true);
      }
      return;
    }

    navigate(`/learn/${course.id}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[28px] border border-gray-100 p-8">
        Đang tải chi tiết khóa học...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-white rounded-[28px] border border-gray-100 p-8">
        Không tìm thấy khóa học.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-slate-700 font-medium hover:bg-gray-50 transition"
          >
            <FiArrowLeft />
            Quay lại
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.8fr] gap-8 items-start">
          <div className="space-y-8">
            <div className="bg-white rounded-[28px] border border-gray-100 p-8 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                  {course.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-orange-500 font-semibold">
                  <FiStar fill="currentColor" />
                  {course.rating}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-[#0F172A] leading-tight mb-4">
                {course.title}
              </h1>

              <p className="text-slate-600 text-[17px] leading-8 mb-8">
                {course.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.outcomes?.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="mt-1 text-blue-600 font-bold">✓</span>
                    <p className="text-slate-700 leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[28px] border border-gray-100 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
                    Nội dung khóa học
                  </h2>
                  <p className="text-slate-600">
                    {course.totalChapters} chương • {course.totalLessons} bài học •
                    Thời lượng {course.totalDuration}
                  </p>
                </div>

                <button className="text-blue-700 font-semibold hover:underline text-left md:text-right">
                  Mở rộng tất cả
                </button>
              </div>

              <div className="space-y-4">
                {course.chapters?.map((chapter, chapterIndex) => (
                  <div
                    key={chapter.id}
                    className="rounded-[22px] border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-6 py-5 bg-[#F8FAFC] flex items-center justify-between text-left hover:bg-[#f1f5f9] transition"
                    >
                      <div>
                        <h3 className="font-bold text-lg text-[#0F172A]">
                          {chapterIndex + 1}. {chapter.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {chapter.lessonsCount} bài học
                        </p>
                      </div>

                      <FiChevronDown
                        className={`text-slate-500 transition-transform ${openChapters[chapter.id] ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openChapters[chapter.id] && (
                      <div className="divide-y divide-gray-100 bg-white">
                        {chapter.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-blue-50/30 transition"
                          >
                            <div className="flex items-center gap-3">
                              <FiPlayCircle className="text-blue-600 text-lg" />
                              <p className="text-slate-700">
                                {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                              </p>
                            </div>
                            <span className="text-sm text-slate-500 whitespace-nowrap">
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 sticky top-24">
            <div className="bg-white rounded-[28px] border border-gray-100 p-5 shadow-sm">
              <div className="relative rounded-[22px] overflow-hidden mb-8">
                <img
                  src={course.introVideoThumbnail || course.image}
                  alt={course.title}
                  className="w-full h-55 object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#001E3C]/70 to-[#001E3C]/20"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-lg mb-4">
                    <FiPlayCircle size={30} />
                  </div>
                  <p className="font-bold text-lg">Xem giới thiệu khóa học</p>
                </div>
              </div>

              <div className="text-center mb-8">
                <p className="text-4xl font-bold text-[#0B5CFF] mb-10">
                  {formatPrice(course.price)}
                </p>

                {isEnrolled ? (
                  <button
                    onClick={handleLearnNow}
                    className="mt-4 w-full bg-[#0B5CFF] hover:bg-[#0047d9] text-white py-3.5 rounded-full font-bold text-lg shadow-md transition"
                  >
                    Học ngay
                  </button>
                ) : (
                  <button
                    onClick={handleEnrollCourse}
                    className="mt-4 w-full bg-[#0B5CFF] hover:bg-[#0047d9] text-white py-3.5 rounded-full font-bold text-lg shadow-md transition"
                  >
                    {isFreeCourse ? "Đăng ký học" : "Thanh toán & đăng ký"}
                  </button>
                )}
              </div>

              <div className="space-y-4 text-slate-700">
                <div className="flex items-center gap-3">
                  <FiUser className="text-blue-700" />
                  <span>Giảng viên: {course.instructor}</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiBookOpen className="text-blue-700" />
                  <span>{course.totalLessons} bài học</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiClock className="text-blue-700" />
                  <span>Thời lượng {course.totalDuration}</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMonitor className="text-blue-700" />
                  <span>Học mọi lúc, mọi nơi</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiStar className="text-blue-700" />
                  <span>Trình độ {course.level}</span>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-[#032a6b] to-[#0B5CFF] rounded-[28px] p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-3">Sẵn sàng học chưa?</h3>
              <p className="text-blue-100 leading-7 mb-5">
                Bắt đầu ngay hôm nay để nâng cao kiến thức và kỹ năng cùng OU
                Education.
              </p>
              <button
                onClick={handleLearnNow}
                className="w-full bg-white text-blue-700 py-3 rounded-full font-bold hover:bg-blue-50 transition"
              >
                {isEnrolled ? "Học ngay" : isFreeCourse ? "Đăng ký miễn phí" : "Thanh toán ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-100 bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-4xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-[42%] bg-linear-to-b from-[#032a6b] to-[#0B5CFF] text-white p-8 lg:p-10 relative">
              <button
                onClick={() => !isProcessingPayment && setShowPaymentModal(false)}
                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <FiX size={20} />
              </button>

              <div className="max-w-sm">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm font-medium mb-5">
                  <FiLock size={14} />
                  Thanh toán an toàn
                </span>

                <h3 className="text-3xl font-bold leading-tight mb-3">
                  Hoàn tất thanh toán
                  <br />
                  để bắt đầu học ngay
                </h3>

                <p className="text-blue-100 leading-7 mb-8">
                  Sau khi thanh toán thành công, hệ thống sẽ tự động mở quyền truy cập khóa học.
                </p>

                <div className="rounded-3xl bg-white/10 border border-white/10 p-5 mb-6">
                  <p className="text-sm text-blue-100 mb-2">Khóa học</p>
                  <h4 className="text-xl font-bold mb-2">{course.title}</h4>
                  <p className="text-sm text-blue-100">Giảng viên: {course.instructor}</p>

                  <div className="mt-5 pt-5 border-t border-white/10">
                    <p className="text-sm text-blue-100 mb-1">Tổng thanh toán</p>
                    <p className="text-4xl font-bold">{formatPrice(course.price)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-100">
                  <FiCheckCircle className="text-white" />
                  Thanh toán thành công mới được vào học
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto max-h-[90vh]">
              <div className="max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Thông tin thanh toán</h3>
                <p className="text-slate-500 mb-6">
                  Vui lòng điền thông tin và chọn phương thức thanh toán phù hợp.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={paymentForm.fullName}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      value={paymentForm.phone}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={paymentForm.email}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="Nhập email"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      rows={3}
                      value={paymentForm.note}
                      onChange={(e) =>
                        setPaymentForm((prev) => ({ ...prev, note: e.target.value }))
                      }
                      placeholder="Nhập ghi chú nếu có"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#0B5CFF] focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="mb-7">
                  <p className="text-sm font-semibold text-slate-700 mb-7">
                    Chọn phương thức thanh toán
                  </p>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 mt-4 rounded-2xl border cursor-pointer transition ${paymentMethod === "momo"
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "momo"}
                        onChange={() => setPaymentMethod("momo")}
                      />
                      <div className="w-11 h-11 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                        <FiSmartphone size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">Ví MoMo</p>
                        <p className="text-sm text-slate-500">
                          Phương thức chính được ưu tiên cho thanh toán khóa học.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2.5 py-1 rounded-full">
                        Khuyên dùng
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === "vnpay"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "vnpay"}
                        onChange={() => setPaymentMethod("vnpay")}
                      />
                      <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FiCreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">VNPay</p>
                        <p className="text-sm text-slate-500">
                          Thanh toán qua cổng VNPay (ATM, QR, Internet Banking).
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition ${paymentMethod === "card"
                        ? "border-violet-500 bg-violet-50"
                        : "border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                        <FiCreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Thẻ ngân hàng</p>
                        <p className="text-sm text-slate-500">
                          Mô phỏng thanh toán bằng thẻ nội địa hoặc quốc tế.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600 mb-6">
                  Sau khi bấm thanh toán, hệ thống sẽ giả lập giao dịch thành công và mở
                  quyền học khóa này cho tài khoản của bạn.
                </div> */}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    disabled={isProcessingPayment}
                    className="flex-1 py-3 rounded-full border border-gray-200 font-semibold text-slate-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={handleConfirmPayment}
                    disabled={isProcessingPayment}
                    className="flex-1 py-3 rounded-full bg-[#0B5CFF] text-white font-semibold hover:bg-blue-700 disabled:opacity-70 shadow-md"
                  >
                    {isProcessingPayment
                      ? "Đang xử lý thanh toán..."
                      : paymentMethod === "momo"
                        ? "Thanh toán với MoMo"
                        : "Xác nhận thanh toán"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetail;