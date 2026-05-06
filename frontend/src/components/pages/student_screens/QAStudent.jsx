import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { qaService } from '../../../services/qaService';
import { courseService } from '../../../services/courseService'; // Giả định đã tạo ở bước trước
import {
  FiMessageCircle, FiPlus, FiSearch, FiThumbsUp,
  FiEye, FiHash, FiClock, FiCheckCircle
} from 'react-icons/fi';
import CreateCoursePostForm from '../form/CreateCoursePostForm';

const QAStudent = () => {
  const [questions, setQuestions] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Hot');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      setLoading(true);
      const [feedRes, coursesRes] = await Promise.all([
        qaService.getForumFeed(1, 10),
        courseService.getMyCourses()
      ]);
  
      // CHUẨN HÓA DỮ LIỆU: Đổi 'id' từ backend thành 'courseId' cho frontend dễ dùng
      const normalizedCourses = (coursesRes || []).map(c => ({
        courseId: c.id, // Lấy 'id' từ Backend gán vào 'courseId'
        title: c.title,
        // các trường khác nếu cần...
      }));
  
      setQuestions(feedRes.data.data);
      setMyCourses(normalizedCourses.slice(0, 3)); 
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans">
      {/* 1. MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        {/* Search & Action Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm câu hỏi, chủ đề, khóa học..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
          >
            <FiPlus /> Đặt câu hỏi
          </button>

          {showForm && (
            <CreateCoursePostForm
              courses={myCourses} 
              onClose={() => setShowForm(false)}
              onSuccess={() => {
                loadData(); // Gọi hàm loadData đã refactor ở trên
              }}
            />
          )}
        </div>

        {/* Tabs Filter */}
        <div className="flex gap-8 mb-6 border-b border-gray-200 px-2">
          {['Hot', 'Mới nhất', 'Chưa trả lời'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-2 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* Question List */}
        <div className="space-y-4">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-3xl" />)}
            </div>
          ) : (
            questions.map((q) => (
              <div
                key={q.post_id}
                onClick={() => navigate(`/question/${q.post_id}`)}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {q.user.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{q.user.name}</h4>
                      <p className="text-xs text-slate-400">{new Date(q.created_at).toLocaleDateString()} • {new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-purple-50 text-[#8B5CF6] text-[10px] font-bold rounded-lg uppercase tracking-wider">
                    {q.course_name || "Cơ bản"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition">
                  {q.title || "Làm sao để học tốt Python?"}
                </h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {q.content}
                </p>

                <div className="flex items-center gap-6 text-slate-400 text-sm">
                  <div className="flex items-center gap-1.5"><FiThumbsUp /> 12</div>
                  <div className="flex items-center gap-1.5"><FiMessageCircle /> {q.stats?.comments || 0} trả lời</div>
                  <div className="flex items-center gap-1.5"><FiEye /> 45 lượt xem</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 2. RIGHT SIDEBAR (STATS & COURSES) */}
      <aside className="w-80 p-8 pl-0 hidden xl:block">
        {/* Khóa học liên quan */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h3 className="font-bold text-slate-800 mb-4">Khóa học liên quan</h3>
          <div className="space-y-4">
            {myCourses.map(course => (
              <div key={course.courseId} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <FiHash />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-700">{course.title}</div>
                  <div className="text-[10px] text-slate-400">120 câu hỏi</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-bold italic">?</div>
            <div className="text-2xl font-black text-slate-800">120</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Câu hỏi</div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <FiMessageCircle className="text-blue-600 mx-auto mb-2 text-xl" />
            <div className="text-2xl font-black text-slate-800">450</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Trả lời</div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default QAStudent;