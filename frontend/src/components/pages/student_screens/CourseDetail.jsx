import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
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
import { paymentService } from "../../../services/paymentService";
import { reviewService } from "../../../services/reviewService";
import { getCurrentUser } from "../../../untils/auth";

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

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    average: 0,
    total: 0,
  });

  const refreshReviewData = (courseId) => {
    const courseReviews = reviewService.getCourseReviews(courseId);
    const stats = reviewService.getCourseReviewStats(courseId);
    const myReview = reviewService.getMyReview(courseId);

    setReviews(courseReviews);
    setReviewStats(stats);

    if (myReview) {
      setReviewForm({
        rating: myReview.rating,
        comment: myReview.comment || "",
      });
    }
  };

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

        refreshReviewData(data.id);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setPaymentForm((prev) => ({
      ...prev,
      fullName: currentUser?.name || "",
      email: currentUser?.email || "",
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
    const currentUser = getCurrentUser();

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

    setIsProcessingPayment(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      paymentService.createPayment({
        courseId: course.id,
        courseTitle: course.title,
        amount: Number(course.price || 0),
        method: paymentMethod,
        customerName: paymentForm.fullName,
        phone: paymentForm.phone,
        email: paymentForm.email,
        note: paymentForm.note,
      });

      enrollmentService.enrollCourse({
        ...course,
        paymentMethod,
        paidAt: new Date().toISOString(),
      });

      setIsEnrolled(true);
      setShowPaymentModal(false);

      alert(
        paymentMethod === "momo"
          ? "Thanh toán MoMo thành công! Bạn đã được đăng ký khóa học."
          : "Thanh toán thành công! Bạn đã được đăng ký khóa học."
      );

      navigate(`/learn/${course.id}`);
    } catch (error) {
      console.error(error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleLearnNow = () => {
    const currentUser = getCurrentUser();

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

  const handleSubmitReview = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      handleRequireAuth("login", "Bạn cần đăng nhập để đánh giá khóa học.");
      return;
    }

    if (!isEnrolled) {
      alert("Bạn cần đăng ký khóa học trước khi đánh giá.");
      return;
    }

    try {
      reviewService.addOrUpdateReview(course.id, reviewForm);
      refreshReviewData(course.id);
      alert("Đã lưu đánh giá của bạn!");
    } catch (error) {
      console.error(error);
      alert("Không thể gửi đánh giá.");
    }
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
                  {reviewStats.total > 0 ? reviewStats.average : course.rating}
                </span>
                <span className="text-sm text-slate-500">
                  ({reviewStats.total} đánh giá)
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

                <button
                  onClick={() => {
                    const expanded = {};
                    course.chapters?.forEach((chapter) => {
                      expanded[chapter.id] = true;
                    });
                    setOpenChapters(expanded);
                  }}
                  className="text-blue-700 font-semibold hover:underline text-left md:text-right"
                >
                  Mở rộng tất cả
                </button>
              </div>

              <div className="space-y-4">
                {course.chapters?.map((chapter, chapterIndex) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-100 rounded-2xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100 transition flex items-center justify-between"
                    >
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-slate-800">
                          {chapterIndex + 1}. {chapter.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {chapter.lessonsCount} bài học
                        </p>
                      </div>
                      <FiChevronDown
                        className={`transition-transform ${
                          openChapters[chapter.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openChapters[chapter.id] && (
                      <div className="divide-y divide-gray-100">
                        {chapter.lessons?.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="px-5 py-4 flex items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1 text-blue-600">
                                <FiPlayCircle />
                              </div>
                              <div>
                                <p className="font-medium text-slate-800">
                                  {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {lesson.duration}
                                </p>
                              </div>
                            </div>

                            <div className="text-slate-400 text-sm">
                              {isEnrolled ? <FiCheckCircle /> : <FiLock />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[28px] border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <FiStar className="text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-800">
                  Đánh giá khóa học
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
                <div className="rounded-3xl bg-slate-50 border border-gray-100 p-6">
                  <div className="text-5xl font-bold text-slate-800 mb-2">
                    {reviewStats.total > 0 ? reviewStats.average : "0.0"}
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <FiStar key={index} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    {reviewStats.total} lượt đánh giá từ học viên
                  </p>
                </div>

                <div className="rounded-3xl border border-gray-100 p-6">
                  <h3 className="font-bold text-slate-800 mb-4">
                    Đánh giá của bạn
                  </h3>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setReviewForm((prev) => ({ ...prev, rating: star }))
                        }
                        className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                          reviewForm.rating >= star
                            ? "bg-orange-50 border-orange-200 text-orange-500"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                      >
                        <FiStar fill="currentColor" />
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Nhập cảm nhận của bạn về khóa học..."
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
                  />

                  <button
                    onClick={handleSubmitReview}
                    className="mt-4 px-5 py-3 rounded-2xl bg-[#002B5B] text-white font-semibold hover:opacity-90"
                  >
                    Gửi đánh giá
                  </button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-5 text-slate-500">
                    Chưa có đánh giá nào cho khóa học này.
                  </div>
                ) : (
                  reviews.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-gray-100 p-5"
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                          <FiUser />
                          {item.userName}
                        </div>
                        <div className="flex items-center gap-1 text-orange-500">
                          {Array.from({ length: item.rating }).map((_, index) => (
                            <FiStar key={index} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-7">
                        {item.comment || "Học viên chưa để lại nhận xét chi tiết."}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="sticky top-6">
            <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">
              <div className="rounded-[22px] overflow-hidden mb-6">
                <img
                  src={course.introVideoThumbnail || course.image}
                  alt={course.title}
                  className="w-full h-56 object-cover"
                />
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-[#0F172A]">
                  {formatPrice(course.price)}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={handleEnrollCourse}
                  className="w-full rounded-2xl bg-[#002B5B] text-white py-3.5 font-semibold hover:opacity-90 transition"
                >
                  {isEnrolled ? "Tiếp tục học" : isFreeCourse ? "Đăng ký học" : "Thanh toán & đăng ký"}
                </button>

                <button
                  onClick={handleLearnNow}
                  className="w-full rounded-2xl border border-gray-200 py-3.5 font-semibold text-slate-700 hover:bg-gray-50 transition"
                >
                  Học ngay
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <FiClock />
                  <span>Thời lượng: {course.totalDuration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiPlayCircle />
                  <span>{course.totalLessons} bài học</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMonitor />
                  <span>Học trên máy tính</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiSmartphone />
                  <span>Học trên điện thoại</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiCheckCircle />
                  <span>Truy cập trọn đời</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl bg-white rounded-[30px] border border-gray-100 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">
                  Thanh toán khóa học
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Hoàn tất thông tin để đăng ký khóa học
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-slate-500 hover:bg-gray-50"
              >
                <FiX />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.95fr] gap-0">
              <div className="p-6 border-r border-gray-100">
                <h4 className="font-bold text-slate-800 mb-4">Thông tin học viên</h4>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Họ và tên"
                    value={paymentForm.fullName}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
                  />

                  <input
                    type="text"
                    placeholder="Số điện thoại"
                    value={paymentForm.phone}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={paymentForm.email}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
                  />

                  <textarea
                    rows={3}
                    placeholder="Ghi chú (không bắt buộc)"
                    value={paymentForm.note}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50">
                <div className="rounded-3xl bg-white border border-gray-100 p-5 mb-5">
                  <h4 className="font-bold text-slate-800 mb-3">
                    Thông tin đơn hàng
                  </h4>
                  <p className="text-slate-700 font-semibold leading-7">
                    {course.title}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Giảng viên: {course.instructor}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-slate-500">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-[#002B5B]">
                      {formatPrice(course.price)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setPaymentMethod("momo")}
                    className={`w-full rounded-2xl border px-4 py-3 flex items-center gap-3 text-left ${
                      paymentMethod === "momo"
                        ? "border-[#002B5B] bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <FiCreditCard className="text-[#002B5B]" />
                    <div>
                      <div className="font-semibold text-slate-800">Ví MoMo</div>
                      <div className="text-sm text-slate-500">
                        Phương thức đề xuất
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("banking")}
                    className={`w-full rounded-2xl border px-4 py-3 flex items-center gap-3 text-left ${
                      paymentMethod === "banking"
                        ? "border-[#002B5B] bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <FiCreditCard className="text-[#002B5B]" />
                    <div>
                      <div className="font-semibold text-slate-800">
                        Chuyển khoản ngân hàng
                      </div>
                      <div className="text-sm text-slate-500">
                        Giả lập thanh toán thành công
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full rounded-2xl bg-[#002B5B] text-white py-3.5 font-semibold hover:opacity-90 transition disabled:opacity-60"
                >
                  {isProcessingPayment ? "Đang xử lý..." : "Xác nhận thanh toán"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDetail;