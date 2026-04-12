import React from "react";
import { FiChevronRight, FiPlay, FiStar } from "react-icons/fi";

const GuestCourseCard = ({ title, author, price, tag, color, icon }) => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
    <div className={`h-36 ${color} relative flex items-center justify-center text-4xl`}>
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span
        className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg ${tag === "PRO" ? "bg-orange-400 text-white" : "bg-green-500 text-white"
          }`}
      >
        {tag}
      </span>
    </div>

    <div className="p-5">
      <h4 className="font-bold text-[15px] mb-1 text-slate-800 group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
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

const TopicCard = ({ icon, title }) => (
  <div className="bg-white rounded-[18px] border border-gray-100 px-5 py-4 flex items-center gap-4 hover:shadow-md transition">
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
      {icon}
    </div>
    <h4 className="font-semibold text-sm text-slate-700">{title}</h4>
  </div>
);

const UserCourseCard = ({ title, author, price, tag, color }) => (
  <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
    <div className={`h-32 ${color} relative flex items-center justify-center text-4xl`}>
      <span className="group-hover:scale-110 transition-transform">📚</span>
      <span
        className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-lg ${tag === "PRO" ? "bg-orange-400 text-white" : "bg-green-500 text-white"
          }`}
      >
        {tag}
      </span>
    </div>
    <div className="p-5">
      <h4 className="font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">
        {title}
      </h4>
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

const GuestHome = () => {
  return (
    <div className="space-y-10">
      <section className="relative bg-linear-to-r from-[#0A328C] to-[#1163ff] rounded-[28px] px-8 py-10 md:px-12 md:py-12 overflow-hidden text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-100">
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
            Học tập hiệu quả,
            <br />
            chinh phục tri thức!
          </h1>

          <p className="text-blue-100 text-base md:text-lg mb-10 leading-relaxed">
            Khám phá các khóa học chất lượng và theo đuổi mục tiêu
            <br />
            học tập cùng OU Education.
          </p>

          <button className="bg-[#0B5CFF] hover:bg-blue-700 px-7 py-3 mt-4 rounded-full font-semibold transition-all flex items-center gap-2 group shadow-lg">
            Khám phá khóa học
            <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative z-10 flex items-center justify-center">
          <img
            src="https://img.freepik.com/free-vector/student-studying-desk_52683-45540.jpg"
            alt="student"
            className="hidden md:block h-64 lg:h-72 object-contain drop-shadow-2xl rounded-2xl"
          />
        </div>

        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
      </section>

      <section>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-800">Khóa học nổi bật</h2>
              <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                Xem tất cả <FiChevronRight />
              </button>
            </div>

            <div className="flex gap-3 mb-6">
              <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
                Tất cả
              </button>
              <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50">
                Miễn phí
              </button>
              <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50 flex items-center gap-2">
                Pro <span className="text-orange-400">👑</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <GuestCourseCard
                title="Tiếng Anh Giao Tiếp"
                author="Cô Mai Anh"
                price="799.000đ"
                tag="PRO"
                color="bg-blue-50"
                icon="🇬🇧"
              />
              <GuestCourseCard
                title="Ngữ Văn 12"
                author="Thầy Lê Minh"
                price="Miễn phí"
                tag="FREE"
                color="bg-purple-50"
                icon="📖"
              />
              <GuestCourseCard
                title="Toán 10 - Số & Hình Học"
                author="Thầy Trần Quang"
                price="699.000đ"
                tag="PRO"
                color="bg-green-50"
                icon="🧮"
              />
              <GuestCourseCard
                title="Hóa Học 11 Cơ Bản"
                author="Cô Nguyễn Yến"
                price="549.000đ"
                tag="PRO"
                color="bg-orange-50"
                icon="⚗️"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[20px] md:text-[22px] font-bold text-slate-800 leading-snug mb-4">
              Tham gia học tập
              <br />
              cùng chúng tôi!
            </h3>

            <p className="text-sm text-gray-500 leading-6 mb-6">
              Đăng ký tài khoản
              <br />
              để bắt đầu hành trình
              <br />
              chinh phục kiến thức của
              <br />
              bạn.
            </p>
            {/* <div className="flex justify-end text-7xl pr-2">⏰</div> */}

            <div className="flex gap-3 mb-6">
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("openAuthModal", { detail: { type: "register" } })
                  )
                }
                className="flex-1 bg-[#0B5CFF] text-white rounded-full py-3 font-semibold hover:bg-blue-700 transition"
              >
                Đăng ký ngay
              </button>

              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("openAuthModal", { detail: { type: "login" } })
                  )
                }
                className="flex-1 bg-white border border-gray-200 text-slate-700 rounded-full py-3 font-semibold hover:bg-gray-50 transition"
              >
                Đăng nhập
              </button>
            </div>

          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-5">Chủ đề phổ biến</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <TopicCard icon="🇬🇧" title="Tiếng Anh Giao Tiếp" />
          <TopicCard icon="🧮" title="Mathematics" />
          <TopicCard icon="⚗️" title="Chemistry" />
          <TopicCard icon="📘" title="Litterture" />
          <TopicCard icon="⚙️" title="Công nghệ như 1" />
        </div>
      </section>
    </div>
  );
};

const UserDashboard = ({ currentUser }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-10">
        <div className="relative bg-[#003580] rounded-4xl p-8 md:p-12 overflow-hidden text-white flex items-center justify-between shadow-xl shadow-blue-100">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chào {currentUser.fullName}! 👋
            </h1>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Học tập hiệu quả, chinh phục tri thức!
              <br />
              <span className="text-sm opacity-80 font-light">
                Khám phá các khóa học chất lượng và theo dõi tiến độ học tập dễ dàng cùng OU Education.
              </span>
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

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Khóa học nổi bật</h2>
            <button className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
              Xem tất cả <FiChevronRight />
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-medium">
              Tất cả
            </button>
            <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50">
              Miễn phí
            </button>
            <button className="px-5 py-2 bg-white text-gray-500 rounded-full text-sm font-medium border border-gray-100 hover:bg-gray-50 flex items-center gap-2">
              Pro <span className="text-orange-400">👑</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <UserCourseCard
              title="Tiếng Anh Giao Tiếp"
              author="Cô Mai Anh"
              price="799.000đ"
              tag="PRO"
              color="bg-blue-50"
            />
            <UserCourseCard
              title="Ngữ Văn 12"
              author="Thầy Lê Minh"
              price="Miễn phí"
              tag="FREE"
              color="bg-purple-50"
            />
            <UserCourseCard
              title="Toán 10 - Đại Số"
              author="Thầy Trần Quang"
              price="699.000đ"
              tag="PRO"
              color="bg-green-50"
            />
            <UserCourseCard
              title="Hóa Học 11 Cơ Bản"
              author="Cô Nguyễn Yến"
              price="599.000đ"
              tag="PRO"
              color="bg-orange-50"
            />
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">Tiếp tục học</h2>
            <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
              Xem tất cả <FiChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🇬🇧
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Tiếng Anh Giao Tiếp Cơ Bản</h4>
                <p className="text-xs text-gray-400 mb-2">
                  Bài 5: Luyện nghe đoạn hội thoại
                </p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[65%]"></div>
                </div>
              </div>
              <button className="bg-blue-600 p-2.5 rounded-full text-white">
                <FiPlay fill="currentColor" size={14} />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                🧮
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">Toán 10 - Đại Số & Hình Học</h4>
                <p className="text-xs text-gray-400 mb-2">
                  Bài 8: Phương trình bậc hai
                </p>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[40%]"></div>
                </div>
              </div>
              <button className="bg-blue-600 p-2.5 rounded-full text-white">
                <FiPlay fill="currentColor" size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>

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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                12
              </div>
              <span className="text-xs text-gray-600">Khóa học đã đăng ký</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                38
              </div>
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
                <h5 className="text-xs font-bold leading-tight">
                  Kỹ năng viết đoạn văn...
                </h5>
                <p className="text-[10px] text-gray-400">Thầy Nguyễn Thành Tâm</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg"></div>
              <div>
                <h5 className="text-xs font-bold leading-tight">
                  Hóa Học 10 - Chương Este
                </h5>
                <p className="text-[10px] text-gray-400">Cô Lê Minh Đức</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Lộ trình học của bạn</h3>
            <button className="text-blue-600 text-xs font-medium hover:underline">
              Xem chi tiết
            </button>
          </div>

          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                <div className="w-0.5 h-16 bg-blue-200"></div>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Tiếng Anh Giao Tiếp</h4>
                <p className="text-xs text-gray-500">Đã hoàn thành • 45%</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-400"></div>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Toán 10 - Đại Số & Hình Học</h4>
                <p className="text-xs text-gray-500">Đang học • 40%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeStudent = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <GuestHome />;
  }

  return <UserDashboard currentUser={currentUser} />;
};

export default HomeStudent;