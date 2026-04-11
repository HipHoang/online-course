import React from 'react';
import { FiBookOpen, FiCheckCircle, FiFilter, FiPlay, FiSearch } from 'react-icons/fi';

const CourseStudent = ({ courses }) => {
  // Dữ liệu gán cứng mặc định nếu không có props truyền vào
  const defaultCourses = [
    {
      id: 1,
      title: "Tiếng Anh Giao Tiếp Cơ Bản",
      category: "Ngoại ngữ",
      progress: 65,
      totalLessons: 24,
      completedLessons: 15,
      image: "https://img.freepik.com/free-vector/english-book-illustration-design_23-2149503378.jpg",
      status: "Đang học"
    },
    {
      id: 2,
      title: "Toán 10 - Đại Số & Hình Học",
      category: "Toán học",
      progress: 40,
      totalLessons: 30,
      completedLessons: 12,
      image: "https://img.freepik.com/free-vector/math-formula-background_23-2148147551.jpg",
      status: "Đang học"
    },
    {
      id: 3,
      title: "Lập trình ReactJS cho người mới",
      category: "Công nghệ thông tin",
      progress: 100,
      totalLessons: 45,
      completedLessons: 45,
      image: "https://img.freepik.com/free-vector/react-concept-illustration_114360-10332.jpg",
      status: "Hoàn thành"
    },
    {
      id: 4,
      title: "Ngữ Văn 12 - Ôn thi THPT Quốc Gia",
      category: "Ngữ văn",
      progress: 10,
      totalLessons: 20,
      completedLessons: 2,
      image: "https://img.freepik.com/free-vector/poetry-concept-illustration_114360-8547.jpg",
      status: "Đang học"
    }
  ];

  const displayCourses = courses || defaultCourses;

  return (
    <div className="space-y-8">
      {/* 1. Header & Bộ lọc */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Khóa học của tôi</h1>
          <p className="text-sm text-slate-500">Bạn đang tham gia {displayCourses.length} khóa học</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm khóa học..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-600">
            <FiFilter />
          </button>
        </div>
      </div>

      {/* 2. Tabs phân loại nhanh */}
      <div className="flex gap-4 border-b border-gray-100 pb-1">
        <button className="px-4 py-2 text-sm font-semibold text-blue-600 border-b-2 border-blue-600">Tất cả</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Đang học</button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Đã hoàn thành</button>
      </div>

      {/* 3. Danh sách khóa học (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
            {/* Ảnh khóa học */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-blue-700 uppercase">
                  {course.category}
                </span>
              </div>
              {course.progress === 100 && (
                <div className="absolute inset-0 bg-green-600/20 flex items-center justify-center">
                  <div className="bg-white p-2 rounded-full text-green-600 shadow-lg">
                    <FiCheckCircle size={30} />
                  </div>
                </div>
              )}
            </div>

            {/* Nội dung khóa học */}
            <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
                <FiBookOpen />
                <span>{course.completedLessons}/{course.totalLessons} bài học</span>
              </div>

              {/* Thanh tiến độ */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-600">Tiến độ</span>
                  <span className="text-blue-600 font-bold">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Nút hành động */}
              <button className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                ${course.progress === 100 
                  ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'}`}
              >
                {course.progress === 100 ? 'Xem chứng chỉ' : (
                  <>
                    Tiếp tục học <FiPlay fill="currentColor" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseStudent;