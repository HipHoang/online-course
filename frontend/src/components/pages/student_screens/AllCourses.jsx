import React, { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";

const formatPrice = (price) => {
  if (!price || Number(price) === 0) return "Miễn phí";
  return `${Number(price).toLocaleString("vi-VN")}VNĐ`;
};

const AllCourses = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedTopic = searchParams.get("topic") || "";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getAllCourses();
        setCourses(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    if (activeTab === "free") {
      data = data.filter((course) => Number(course.price) === 0);
    }

    if (activeTab === "pro") {
      data = data.filter((course) => Number(course.price) > 0);
    }

    if (selectedTopic.trim()) {
      data = data.filter(
        (course) =>
          course.category?.toLowerCase() === selectedTopic.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase();
      data = data.filter(
        (course) =>
          course.title?.toLowerCase().includes(keyword) ||
          course.category?.toLowerCase().includes(keyword) ||
          course.instructor?.toLowerCase().includes(keyword)
      );
    }

    return data;
  }, [courses, searchTerm, activeTab, selectedTopic]);

  if (loading) {
    return (
      <div className="bg-white rounded-[28px] border border-gray-100 p-10 text-center text-slate-500">
        Đang tải khóa học...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-slate-700 font-medium hover:bg-gray-50 transition"
        >
          <FiArrowLeft />
          Quay lại
        </button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
            Tất cả khóa học
          </h1>
          <p className="text-sm text-slate-500 mt-3">
            Hiển thị {filteredCourses.length} khóa học
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
          />
        </div>
      </div>

      <div className="flex gap-6 border-b border-gray-100 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 text-sm font-semibold transition ${activeTab === "all"
            ? "text-[#002B5B] border-b-2 border-[#002B5B]"
            : "text-gray-500 hover:text-[#002B5B]"
            }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setActiveTab("free")}
          className={`px-4 py-2 text-sm font-semibold transition ${activeTab === "free"
            ? "text-green-600 border-b-2 border-green-600"
            : "text-gray-500 hover:text-green-600"
            }`}
        >
          Miễn phí
        </button>

        <button
          onClick={() => setActiveTab("pro")}
          className={`px-4 py-2 text-sm font-semibold transition ${activeTab === "pro"
            ? "text-[#002B5B] border-b-2 border-[#002B5B]"
            : "text-gray-500 hover:text-[#002B5B]"
            }`}
        >
          Pro
        </button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-gray-100 p-10 text-center text-slate-500">
          Không tìm thấy khóa học phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id || course.course_id}
              onClick={() => navigate(`/courses/${course.id || course.course_id}`)}
              className="bg-white rounded-[28px] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden bg-slate-50">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    📚
                  </div>
                )}

                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold ${Number(course.price) > 0
                      ? "bg-orange-400 text-white"
                      : "bg-green-500 text-white"
                      }`}
                  >
                    {Number(course.price) > 0 ? "PRO" : "FREE"}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 min-h-12 group-hover:text-[#002B5B] transition-colors">
                  {course.title}
                </h3>

                <p className="text-xs text-gray-400 mb-3">
                  {course.instructor}
                </p>

                <p className="text-sm font-bold text-right text-[#002B5B]">
                  {formatPrice(course.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;