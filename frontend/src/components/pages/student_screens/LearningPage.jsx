
import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronDown,
  FiFileText,
  FiHelpCircle,
  FiLock,
  FiPlayCircle,
  FiSend,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";
import { qaService } from "../../../services/qaService";
import { getCurrentUser } from "../../../untils/auth";

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState([]);

  const refreshQA = (courseId) => {
    setQuestions(qaService.getCourseQuestions(courseId));
  };

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await courseService.getCourseById(id);
      setCourse(data);

      const enrollments = enrollmentService.getMyCourses();
      const enrolled = enrollments.find((item) => item.courseId === Number(id));
      setEnrolledCourse(enrolled || null);

      const lessonId = enrolled?.currentLessonId;
      let foundLesson = null;

      const initialState = {};
      data.chapters?.forEach((chapter, index) => {
        initialState[chapter.id] = index === 0;

        chapter.lessons?.forEach((lesson) => {
          if (lesson.id === lessonId) {
            foundLesson = lesson;
          }
        });
      });

      setOpenChapters(initialState);

      const firstLesson =
        data?.chapters?.[0]?.lessons?.[0] ||
        data?.lessons?.[0] ||
        null;

      setCurrentLesson(foundLesson || firstLesson);
      refreshQA(data.id);
    };

    fetchCourse();
  }, [id]);

  const allLessons = useMemo(() => {
    if (!course) return [];
    return course.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({
        ...lesson,
        chapterTitle: chapter.title,
      }))
    );
  }, [course]);

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLesson?.id
  );

  const completedLessons = enrolledCourse?.completedLessons || 0;
  const unlockedIndex = Math.min(completedLessons, allLessons.length - 1);

  const handleSelectLesson = (lesson, lessonIndex) => {
    if (lessonIndex > unlockedIndex) {
      alert("Bạn cần hoàn thành bài hiện tại để mở khóa bài tiếp theo.");
      return;
    }

    setCurrentLesson(lesson);
  };

  const handleCompleteLesson = () => {
    if (!currentLesson) return;

    const newCompletedLessons = Math.max(
      completedLessons,
      currentLessonIndex + 1
    );

    enrollmentService.updateLessonProgress(
      id,
      currentLesson.id,
      newCompletedLessons
    );

    const enrollments = enrollmentService.getMyCourses();
    const enrolled = enrollments.find((item) => item.courseId === Number(id));
    setEnrolledCourse(enrolled || null);

    alert(
      newCompletedLessons >= allLessons.length
        ? "Chúc mừng! Bạn đã hoàn thành khóa học."
        : "Đã hoàn thành bài học. Bài tiếp theo đã được mở khóa!"
    );
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextIndex = currentLessonIndex + 1;

      if (nextIndex > unlockedIndex) {
        alert("Bạn cần bấm hoàn thành bài hiện tại để mở bài tiếp theo.");
        return;
      }

      setCurrentLesson(allLessons[nextIndex]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLesson(prevLesson);
    }
  };

  const toggleChapter = (chapterId) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  const handleAskQuestion = () => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert("Bạn cần đăng nhập để đặt câu hỏi.");
      return;
    }

    if (!questionText.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }

    try {
      qaService.askQuestion(id, questionText);
      setQuestionText("");
      refreshQA(id);
    } catch (error) {
      console.error(error);
      alert("Không thể gửi câu hỏi.");
    }
  };

  if (!course) {
    return <div className="p-6">Đang tải bài học...</div>;
  }

  if (!currentLesson) {
    return (
      <div className="p-6">
        Khóa học này hiện chưa có bài học để hiển thị.
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6">
      <div className="flex-1 bg-white rounded-[28px] border border-gray-100 overflow-hidden shadow-sm flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-slate-700 font-medium"
          >
            <FiArrowLeft />
            Quay lại
          </button>

          <div className="text-sm text-slate-500">
            {completedLessons}/{allLessons.length} bài đã hoàn thành
          </div>
        </div>

        <div className="flex-1 bg-[#0b1220] flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="relative w-[85%] max-w-4xl">
              <img
                src={course.introVideoThumbnail || course.image}
                alt={currentLesson.title}
                className="w-full max-h-130 object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/25 rounded-2xl flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-[#ff6b2c] text-white flex items-center justify-center shadow-xl">
                  <FiPlayCircle size={40} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <button
            onClick={handlePrevLesson}
            className="px-5 py-3 rounded-full border border-gray-200 text-slate-500 font-semibold hover:bg-gray-50"
          >
            Bài trước
          </button>

          <div className="text-center">
            <h2 className="font-bold text-lg text-slate-800">{currentLesson.title}</h2>
            <p className="text-sm text-slate-500">{currentLesson.duration}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCompleteLesson}
              className="px-5 py-3 rounded-full border border-green-200 bg-green-50 text-green-700 font-semibold hover:bg-green-100"
            >
              Hoàn thành bài
            </button>

            <button
              onClick={handleNextLesson}
              className="px-5 py-3 rounded-full bg-[#0B5CFF] text-white font-semibold hover:bg-blue-700"
            >
              Bài tiếp theo
            </button>
          </div>
        </div>
      </div>

      <div className="w-96 bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-slate-800">Nội dung khóa học</h3>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
            <div className="font-semibold text-slate-800">Tiến độ học tập</div>
            <p className="text-sm text-slate-500">
              Hoàn thành bài hiện tại để mở khóa bài tiếp theo
            </p>
            <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-[#002B5B]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((completedLessons / Math.max(allLessons.length, 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {course.chapters?.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="border-b border-gray-100">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50"
              >
                <div>
                  <h4 className="font-bold text-lg text-slate-800">
                    {chapterIndex + 1}. {chapter.title}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {chapter.lessonsCount} bài học
                  </p>
                </div>
                <FiChevronDown
                  className={`transition-transform ${openChapters[chapter.id] ? "rotate-180" : ""}`}
                />
              </button>

              {openChapters[chapter.id] && (
                <div className="bg-white">
                  {chapter.lessons?.map((lesson, lessonIndex) => {
                    const flatIndex = allLessons.findIndex(
                      (item) => item.id === lesson.id
                    );
                    const isUnlocked = flatIndex <= unlockedIndex;
                    const isCompleted = flatIndex < completedLessons;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => handleSelectLesson(lesson, flatIndex)}
                        className={`w-full text-left px-4 py-4 flex items-center justify-between hover:bg-blue-50 ${
                          currentLesson.id === lesson.id ? "bg-orange-50" : ""
                        }`}
                      >
                        <div>
                          <p className="text-slate-800">
                            {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                          </p>
                          <p className="text-sm text-slate-500">{lesson.duration}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCompleted ? (
                            <FiCheckCircle className="text-green-600" />
                          ) : isUnlocked ? (
                            <FiPlayCircle className="text-[#ff6b2c]" />
                          ) : (
                            <FiLock className="text-slate-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 font-medium text-slate-700 hover:bg-gray-50">
              <FiFileText />
              Ghi chú
            </button>
            <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 font-medium text-slate-700 hover:bg-gray-50">
              <FiHelpCircle />
              Hỏi đáp
            </button>
          </div>

          <div className="rounded-2xl border border-gray-100 p-4">
            <div className="font-semibold text-slate-800 mb-3">Đặt câu hỏi</div>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Nhập câu hỏi của bạn về bài học hoặc khóa học..."
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#002B5B]"
            />
            <button
              onClick={handleAskQuestion}
              className="mt-3 w-full rounded-2xl bg-[#002B5B] text-white py-3 font-semibold flex items-center justify-center gap-2"
            >
              <FiSend />
              Gửi câu hỏi
            </button>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 pr-2 border border-red-300">
            {questions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-slate-500">
                Chưa có câu hỏi nào cho khóa học này.
              </div>
            ) : (
              questions.map((item) => (
                <div key={item.id} className="rounded-2xl border border-gray-100 p-4">
                  <div className="text-sm font-semibold text-slate-800 mb-1">
                    {item.userName}
                  </div>
                  <p className="text-sm text-slate-600 leading-6">
                    {item.question}
                  </p>

                  {item.answer && (
                    <div className="mt-3 rounded-xl bg-slate-50 border border-gray-100 p-3">
                      <div className="text-xs font-semibold text-[#002B5B] mb-1">
                        Phản hồi từ {item.answer.answeredBy}
                      </div>
                      <p className="text-sm text-slate-600 leading-6">
                        {item.answer.text}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;