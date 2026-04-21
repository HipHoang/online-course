import React from "react";

const teacherCourses = [
  {
    id: 1,
    title: "Tiếng Anh Giao Tiếp Cơ Bản",
    students: 1240,
    price: "1,299,000đ",
    status: "Đã xuất bản",
  },
  {
    id: 2,
    title: "Ngữ Văn 12 - Nghị luận xã hội",
    students: 980,
    price: "Miễn phí",
    status: "Đã xuất bản",
  },
  {
    id: 3,
    title: "Toán 10 - Đại số & Hình học",
    students: 680,
    price: "1,199,000đ",
    status: "Bản nháp",
  },
];

const CourseTeacher = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Khóa học của tôi</h1>
        <p className="text-slate-500 mt-2">
          Danh sách khóa học bạn đang quản lý
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {teacherCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-xl text-sm font-medium ${
                  course.status === "Đã xuất bản"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {course.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-3">
              {course.title}
            </h3>

            <div className="space-y-2 text-slate-600">
              <p>Học viên: {course.students}</p>
              <p>Giá: {course.price}</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-[#0B5CFF] text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition">
                Chỉnh sửa
              </button>
              <button className="flex-1 border border-gray-200 py-3 rounded-2xl font-semibold text-slate-700 hover:bg-gray-50 transition">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseTeacher;