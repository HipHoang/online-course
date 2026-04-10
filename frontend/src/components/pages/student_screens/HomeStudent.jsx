import React from 'react';
import { FiChevronRight, FiPlay, FiStar } from 'react-icons/fi';

// Sub-component cho Card khóa học (Để trong file này vì nó phục vụ riêng cho Home)
const CourseCard = ({ title, author, price, tag, color }) => (
  <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
    <div className={`h-32 ${color} relative flex items-center justify-center text-4xl`}>
      <span className="group-hover:scale-110 transition-transform">📚</span>
      <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg ${tag === 'PRO' ? 'bg-orange-400 text-white' : 'bg-green-500 text-white'}`}>
        {tag}
      </span>
    </div>
    <div className="p-5">
      <h4 className="font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
      <p className="text-xs text-gray-400 mb-4">{author}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-orange-400">
          <FiStar fill="currentColor" size={12} />
          <span className="text-xs font-bold">4.9</span>
        </div>
        <span className="text-sm font-bold text-blue-700">{price}</span>
      </div>
    </div>
  </div>
);

const HomeStudent = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      
      {/* CỘT TRÁI: CHIẾM 75% KÍCH THƯỚC */}
      <div className="flex-1 space-y-10">
        
        {/* 1. Banner Chào mừng */}
        <div className="relative bg-[#003580] rounded-4xl p-8 md:p-12 overflow-hidden text-white flex items-center justify-between shadow-xl shadow-blue-100">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Chào mừng đến với OU Education 👋</h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Học tập hiệu quả, chinh phục tri thức!<br />
              <span className="text-sm opacity-80 font-light">Khám phá các khóa học chất lượng và theo dõi tiến độ học tập dễ dàng cùng OU Education.</span>
            </p>
            <button className="bg-[#007bff] hover:bg-blue-600 px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 group">
              Khám phá khóa học 
              <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="hidden md:block w-64 h-64 bg-blue-400/20 rounded-full blur-3xl absolute -right-10 -bottom-10"></div>
          <img 
            src="https://img.freepik.com/free-vector/learning-concept-illustration_114360-6186.jpg" 
            alt="illustration" 
            className="hidden md:block h-60 relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* 2. Phần Khóa học nổi bật */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Khóa học nổi bật</h2>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Xem tất cả <FiChevronRight />
            </button>
          </div>
          <div className="flex gap-3 mb-6">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">Tất cả</button>
            <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50">Miễn phí</button>
            <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50 flex items-center gap-2">
              Pro <span className="text-orange-400">👑</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <CourseCard title="Tiếng Anh Giao Tiếp" author="Cô Mai Anh" price="799.000đ" tag="PRO" color="bg-blue-50" />
            <CourseCard title="Ngữ Văn 12" author="Thầy Lê Minh" price="Miễn phí" tag="FREE" color="bg-purple-50" />
            <CourseCard title="Toán 10 - Đại Số" author="Thầy Trần Quang" price="699.000đ" tag="PRO" color="bg-green-50" />
            <CourseCard title="Hóa Học 11 Cơ Bản" author="Cô Nguyễn Yến" price="599.000đ" tag="PRO" color="bg-orange-50" />
          </div>
        </section>

        {/* 3. Tiếp tục học */}
        <section>
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Tiếp tục học</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              Xem tất cả <FiChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🇬🇧</div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">Tiếng Anh Giao Tiếp Cơ Bản</h4>
                  <p className="text-xs text-gray-400 mb-2">Bài 5: Luyện nghe đoạn hội thoại</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[65%]"></div>
                  </div>
                </div>
                <button className="bg-blue-600 p-2.5 rounded-full text-white"><FiPlay fill="currentColor" size={14} /></button>
             </div>
          </div>
        </section>
      </div>

      {/* CỘT PHẢI: CHIẾM 25% */}
      <div className="w-full lg:w-80 space-y-8">
        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold">Tiến độ học tập</h3>
            <select className="text-xs bg-gray-50 p-1 rounded border-none outline-none">
              <option>Tháng 5, 2025</option>
            </select>
          </div>
          <div className="flex justify-center mb-6">
             <div className="w-32 h-32 rounded-full border-10 border-gray-100 border-t-blue-600 flex items-center justify-center relative">
                <span className="text-2xl font-bold">72%</span>
             </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">12</div>
              <span className="text-xs text-gray-600">Khóa học đã đăng ký</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">38</div>
              <span className="text-xs text-gray-600">Bài học đã hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
          <h3 className="font-bold mb-4">Gợi ý cho bạn</h3>
          <div className="space-y-4">
             <div className="flex gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg"></div>
                <div>
                  <h5 className="text-xs font-bold leading-tight">Kỹ năng viết đoạn văn...</h5>
                  <p className="text-[10px] text-gray-400">Thầy Nguyễn Thành Tâm</p>
                </div>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomeStudent;