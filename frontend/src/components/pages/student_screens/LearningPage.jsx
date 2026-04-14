import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiHelpCircle,
  FiPlayCircle,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";
import { enrollmentService } from "../../../services/enrollmentService";

const LearningPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [openChapters, setOpenChapters] = useState({});
  const [currentLesson, setCurrentLesson] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      const data = await courseService.getCourseById(id);
      setCourse(data);

      const enrollments = enrollmentService.getMyCourses();
      const enrolled = enrollments.find((item) => item.courseId === Number(id));

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

  const completedLessons = currentLessonIndex + 1;

  const handleSelectLesson = (lesson) => {
    setCurrentLesson(lesson);
    enrollmentService.updateLessonProgress(id, lesson.id, completedLessons);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLesson(nextLesson);
      enrollmentService.updateLessonProgress(id, nextLesson.id, currentLessonIndex + 2);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLesson(prevLesson);
      enrollmentService.updateLessonProgress(id, prevLesson.id, currentLessonIndex);
    }
  };

  const toggleChapter = (chapterId) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
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
            {completedLessons}/{allLessons.length} bài học
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

          <button
            onClick={handleNextLesson}
            className="px-5 py-3 rounded-full bg-[#0B5CFF] text-white font-semibold hover:bg-blue-700"
          >
            Bài tiếp theo
          </button>
        </div>
      </div>

      <div className="w-90 bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-slate-800">Nội dung khóa học</h3>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="rounded-2xl border border-gray-100 p-4 bg-slate-50">
            <div className="font-semibold text-slate-800">Bắt đầu chuỗi ngày học</div>
            <p className="text-sm text-slate-500">Hoàn thành bài học để bắt đầu</p>
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
                  className={`transition-transform ${openChapters[chapter.id] ? "rotate-180" : ""
                    }`}
                />
              </button>

              {openChapters[chapter.id] && (
                <div className="bg-white">
                  {chapter.lessons?.map((lesson, lessonIndex) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full text-left px-4 py-4 flex items-center justify-between hover:bg-blue-50 ${currentLesson.id === lesson.id ? "bg-orange-50" : ""
                        }`}
                    >
                      <div>
                        <p className="text-slate-800">
                          {chapterIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </p>
                        <p className="text-sm text-slate-500">{lesson.duration}</p>
                      </div>
                      <FiPlayCircle className="text-[#ff6b2c]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4 grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 font-medium text-slate-700 hover:bg-gray-50">
            <FiFileText />
            Ghi chú
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 font-medium text-slate-700 hover:bg-gray-50">
            <FiHelpCircle />
            Hỏi đáp
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;