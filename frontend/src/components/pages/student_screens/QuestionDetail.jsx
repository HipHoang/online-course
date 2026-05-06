import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { qaService } from '../../../services/qaService';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';


const QuestionDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null); // Lưu thông tin câu hỏi
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);

  // 2. Fetch cả thông tin câu hỏi và danh sách câu trả lời
  const fetchData = async () => {
    try {
      setLoading(true);
      const [postRes, answersRes] = await Promise.all([
        qaService.getSinglePost(postId), // API Tín vừa thêm ở Backend
        qaService.getQuestionAnswers(postId)
      ]);
      setPost(postRes.data);
      setAnswers(answersRes.data.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [postId]);

  const handleSubmit = async () => {
    if (!newAnswer.trim() || newAnswer === '<p><br></p>') return;
    try {
      await qaService.createAnswer(postId, newAnswer);
      setNewAnswer("");
      fetchData(); // Tải lại để hiện câu trả lời mới
    } catch (error) {
      alert("Lỗi khi gửi câu trả lời");
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 3. Hiển thị chi tiết câu hỏi (Post) */}
      {post && (
        <div className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {post.user.name[0]}
            </div>
            <div>
              <h4 className="font-bold text-slate-800">{post.user.name}</h4>
              <p className="text-xs text-slate-400">{new Date(post.created_at).toLocaleString()}</p>
            </div>
          </div>
          {/* Dùng dangerouslySetInnerHTML nếu nội dung post cũng là HTML */}
          <div className="text-lg text-slate-800 leading-relaxed">
            {post.content}
          </div>
        </div>
      )}
      
      {/* 4. VỊ TRÍ TÍCH HỢP RICH TEXT EDITOR */}
      <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4 text-xl">Trả lời câu hỏi</h3>
        
        <div className="mb-4">
          <ReactQuill 
            theme="snow"
            value={newAnswer}
            onChange={setNewAnswer}
            placeholder="Viết câu trả lời chi tiết của bạn tại đây..."
            className="rounded-2xl overflow-hidden border-gray-200"
          />
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSubmit} 
            className="bg-[#0B5CFF] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            Gửi trả lời
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-xl">
          {answers.length} câu trả lời
        </h3>
        {answers.map(a => (
          <div key={a.comment_id} className="bg-white p-6 rounded-[28px] border border-gray-50 shadow-sm">
            <div className="flex items-center gap-2 mb-3 font-semibold text-slate-700">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                {a.user.name[0]}
              </div>
              <span>{a.user.name}</span>
            </div>
            {/* 5. Quan trọng: Hiển thị nội dung HTML từ Editor */}
            <div 
              className="text-slate-600 prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: a.content }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDetail;