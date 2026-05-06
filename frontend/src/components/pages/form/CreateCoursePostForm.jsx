import React, { useState, useMemo } from 'react';
import { qaService } from '../../../services/qaService';
import { FiX, FiSend, FiBookOpen, FiAlertCircle } from 'react-icons/fi';

const CreateCoursePostForm = ({ courses = [], onClose, onSuccess }) => {
    // 1. State Management
    const [formData, setFormData] = useState({
        courseId: '',
        content: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 2. Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(''); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const validateForm = () => {
        if (!formData.courseId) return "Vui lòng chọn một khóa học cụ thể.";
        if (!formData.content.trim()) return "Nội dung câu hỏi không được bỏ trống.";
        if (formData.content.trim().length < 10) return "Nội dung quá ngắn, vui lòng mô tả chi tiết hơn.";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ép kiểu về Number để tránh gửi chuỗi "NaN"
        const cleanId = parseInt(formData.courseId, 10);

        if (!cleanId || isNaN(cleanId)) {
            setError("Vui lòng chọn một khóa học cụ thể.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            // Đảm bảo courseId được gửi đi là kiểu Number (int) để khớp với backend Flask
            const res = await qaService.createQuestion(
                Number(formData.courseId),
                formData.content.trim()
            );

            if (res.status === "success" || res.post_id) {
                onSuccess?.();
                onClose();
            }
        } catch (err) {
            console.error("Submit Error:", err);
            const serverMsg = err.response?.data?.message || "Không thể kết nối đến máy chủ.";
            setError(serverMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Render Helpers
    const courseOptions = useMemo(() => (
        courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
                {course.title}
            </option>
        ))
    ), [courses]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden transform transition-all animate-in zoom-in duration-300">

                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-extrabold text-slate-800">Đặt câu hỏi mới</h3>
                        <p className="text-xs text-slate-500 mt-1">Chia sẻ thắc mắc của bạn với cộng đồng</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-full transition-all"
                        aria-label="Close"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 text-sm rounded-2xl border border-red-100 animate-shake">
                            <FiAlertCircle className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Course Selection */}
                    <div className="space-y-2">
                        <label htmlFor="courseId" className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
                            <FiBookOpen className="text-blue-600" /> Khóa học liên quan
                        </label>
                        <select
                            name="courseId" // Khớp với key trong formData
                            value={formData.courseId} // Sửa từ formData.id thành formData.courseId
                            onChange={handleChange}
                            className="..."
                        >
                            <option value="">-- Chọn khóa học --</option>
                            {courses.map((course) => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-2">
                        <label htmlFor="content" className="text-sm font-bold text-slate-700 px-1">Chi tiết thắc mắc</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Ví dụ: Làm sao để fix lỗi CORS khi dùng Flask và React?"
                            rows="5"
                            className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none text-slate-700 resize-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-6 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 active:scale-95 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-2 py-4 px-6 bg-blue-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700 hover:shadow-blue-300'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FiSend /> Gửi câu hỏi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePostForm;