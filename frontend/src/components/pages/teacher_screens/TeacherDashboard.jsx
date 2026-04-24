import React, { useState } from "react";
import {
  FiBookOpen,
  FiDollarSign,
  FiMessageSquare,
  FiPlus,
  FiStar,
  FiUsers,
} from "react-icons/fi";
import CreateCourseForm from "../form/CreateCourseForm";



const stats = [
  { title: "Khóa học", value: "12", icon: <FiBookOpen size={22} /> },
  { title: "Học viên", value: "2,560", icon: <FiUsers size={22} /> },
  { title: "Doanh thu", value: "56.400.000đ", icon: <FiDollarSign size={22} /> },
  { title: "Đánh giá TB", value: "4.9", icon: <FiStar size={22} /> },
];

const questions = [
  {
    id: 1,
    avatar: "N",
    color: "bg-violet-500",
    title: "Làm sao để viết đoạn văn nghị luận xã hội tốt hơn?",
    meta: "Nguyễn Thanh Tâm • Ngữ văn 12 • 3 giờ trước",
  },
  {
    id: 2,
    avatar: "H",
    color: "bg-orange-500",
    title: "Phương pháp cân bằng phương trình hóa học nhanh?",
    meta: "Lê Minh Đức • Hóa học 11 • 5 giờ trước",
  },
  {
    id: 3,
    avatar: "T",
    color: "bg-blue-600",
    title: "Cách giải bài tập phương trình bậc 2 hiệu quả?",
    meta: "Trần Gia Huy • Toán 10 • 1 ngày trước",
  },
];



const teacherCourses = [
  {
    id: 1,
    title: "Tiếng Anh Giao Tiếp Cơ Bản",
    students: "1,240",
    price: "1,299,000đ",
    status: "Đã xuất bản",
    lessons: 50,
  },
  {
    id: 2,
    title: "Ngữ Văn 12 - Nghị luận xã hội",
    students: "980",
    price: "Miễn phí",
    status: "Đã xuất bản",
    lessons: 50,
  },
  {
    id: 3,
    title: "Toán 10 - Đại số & Hình học",
    students: "680",
    price: "1,199,000đ",
    status: "Bản nháp",
    lessons: 54,
  },
];

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 mt-2">
            Tổng quan hoạt động giảng dạy của bạn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-slate-700 outline-none focus:border-[#002B5B]">
            <option>Tháng 5, 2025</option>
            <option>Tháng 4, 2025</option>
            <option>Tháng 3, 2025</option>
          </select>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#0B5CFF] hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-md transition"
          >
            <FiPlus />
            Tạo khóa học
          </button>
        </div>
      </div>

      {isModalOpen && (
        <CreateCourseForm onClose={() => setIsModalOpen(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0B5CFF] flex items-center justify-center">
                {item.icon}
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-800">{item.value}</p>
                <p className="text-slate-500 mt-1">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_0.9fr] gap-6">
        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Doanh thu 6 tháng gần nhất
          </h2>

          <div className="h-85 rounded-3xl bg-slate-50 border border-gray-100 flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-lg font-semibold text-slate-700 mb-2">
                Biểu đồ doanh thu
              </p>
              <p className="text-slate-500 text-sm">
                Tạm thời dùng dữ liệu cứng. Khi có API anh sẽ gắn biểu đồ thật cho em.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              Câu hỏi cần trả lời
            </h2>
            <button className="text-[#0B5CFF] font-medium hover:underline">
              Xem tất cả
            </button>
          </div>

          <div className="space-y-5">
            {questions.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${item.color} text-white flex items-center justify-center font-bold flex-none`}
                >
                  {item.avatar}
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 leading-6">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{item.meta}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full bg-[#0B5CFF] hover:bg-blue-700 text-white py-3.5 rounded-2xl font-semibold transition inline-flex items-center justify-center gap-2">
            <FiMessageSquare />
            Trả lời câu hỏi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Khóa học của tôi</h2>
          <button className="text-[#0B5CFF] font-medium hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-left">
                <th className="px-5 py-4 rounded-l-2xl font-semibold">Khóa học</th>
                <th className="px-5 py-4 font-semibold">Học viên</th>
                <th className="px-5 py-4 font-semibold">Giá</th>
                <th className="px-5 py-4 font-semibold">Trạng thái</th>
                <th className="px-5 py-4 rounded-r-2xl font-semibold">Bài học</th>
              </tr>
            </thead>

            <tbody>
              {teacherCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-100">
                  <td className="px-5 py-5 font-semibold text-slate-800">
                    {course.title}
                  </td>
                  <td className="px-5 py-5 text-slate-700">{course.students}</td>
                  <td className="px-5 py-5 text-slate-700">{course.price}</td>
                  <td className="px-5 py-5">
                    <span
                      className={`px-3 py-1 rounded-xl text-sm font-medium ${
                        course.status === "Đã xuất bản"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-slate-700">{course.lessons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
  );

  
};

export default TeacherDashboard;