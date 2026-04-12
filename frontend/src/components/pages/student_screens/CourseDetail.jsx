import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiChevronDown,
  FiClock,
  FiMonitor,
  FiPlayCircle,
  FiStar,
  FiUser,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";

const formatPrice = (price) => {
  if (!price || price === 0) return "Miễn phí";
  return `${price.toLocaleString("vi-VN")}đ`;
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openChapters, setOpenChapters] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);

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

  const handleEnrollCourse = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      handleRequireAuth(
        "login",
        "Bạn cần đăng nhập để đăng ký khóa học này."
      );
      return;
    }

    try {
      enrollmentService.enrollCourse(course);
      setIsEnrolled(true);
      alert("Đăng ký khóa học thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi đăng ký khóa học.");
    }
  };

  const handleLearnNow = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      handleRequireAuth(
        "login",
        "Bạn cần đăng nhập để học khóa học này."
      );
      return;
    }

    try {
      if (!isEnrolled) {
        enrollmentService.enrollCourse(course);
        setIsEnrolled(true);
      }

      navigate(`/learn/${course.id}`);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi vào khóa học.");
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
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-slate-700 font-medium hover:bg-gray-50 transition"
      >
        <FiArrowLeft />
        Quay lại
      </button>

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
                  {course.totalChapters} chương • {course.totalLessons} bài học
                  • Thời lượng {course.totalDuration}
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
                      className={`text-slate-500 transition-transform ${
                        openChapters[chapter.id] ? "rotate-180" : ""
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
                              {chapterIndex + 1}.{lessonIndex + 1}{" "}
                              {lesson.title}
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
            <div className="relative rounded-[22px] overflow-hidden mb-6">
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

            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-[#0B5CFF] mb-4">
                {formatPrice(course.price)}
              </p>

              {isEnrolled ? (
                <button
                  onClick={handleLearnNow}
                  className="w-full bg-[#0B5CFF] hover:bg-[#0047d9] text-white py-3.5 rounded-full font-bold text-lg shadow-md transition"
                >
                  Học ngay
                </button>
              ) : (
                <button
                  onClick={handleEnrollCourse}
                  className="w-full bg-[#0B5CFF] hover:bg-[#0047d9] text-white py-3.5 rounded-full font-bold text-lg shadow-md transition"
                >
                  Đăng ký học
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
              Học ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;