import React from "react";

export const formatPrice = (price) => {
  if (!price || Number(price) === 0) return "Miễn phí";
  return `${Number(price).toLocaleString("vi-VN")}VNĐ`;
};

/**
 * Thẻ khóa học dạng lưới — cùng giao diện với AllCourses.
 */
export const CourseGridCard = ({ course, onSelect }) => {
  const id = Number(course.id ?? course.course_id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(id);
        }
      }}
      className="bg-white rounded-[28px] border border-gray-100 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
    >
      <div className="relative h-44 overflow-hidden bg-slate-50">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📚
          </div>
        )}

        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
              Number(course.price) > 0
                ? "bg-orange-400 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {Number(course.price) > 0 ? "PRO" : "FREE"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 min-h-12 group-hover:text-[#002B5B] transition-colors">
          {course.title}
        </h3>

        <p className="text-xs text-gray-400 mb-2">{course.instructor}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
            {course.level}
          </span>
          <span className="text-xs text-orange-500 font-semibold">
            ⭐ {course.rating}
          </span>
        </div>

        <p className="text-sm font-bold text-right text-[#002B5B]">
          {formatPrice(course.price)}
        </p>
      </div>
    </div>
  );
};

/**
 * Hàng danh sách ngang kiểu YouTube (thumbnail trái, nội dung phải).
 */
export const CourseListRow = ({ course, onSelect }) => {
  const id = course.id ?? course.course_id;
  const snippet =
    course.description?.slice(0, 140) ||
    course.category ||
    "Khóa học trực tuyến";

  return (
    <button
      type="button"
      onClick={() => onSelect?.(id)}
      className="w-full flex flex-col sm:flex-row gap-4 sm:gap-5 px-1 py-3 sm:px-3 sm:py-4 rounded-2xl border border-transparent bg-white hover:border-slate-200/80 hover:bg-slate-50/90 hover:shadow-sm active:scale-[0.99] transition-all duration-200 text-left group"
    >
      <div className="relative w-full sm:max-w-[min(100%,20rem)] sm:w-72 shrink-0 aspect-video rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-200/60 group-hover:ring-slate-300/80">
        {course.image ? (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📚
          </div>
        )}
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-sm text-[10px] font-bold shadow-sm ${
            Number(course.price) > 0
              ? "bg-orange-500 text-white"
              : "bg-emerald-600 text-white"
          }`}
        >
          {Number(course.price) > 0 ? "PRO" : "FREE"}
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 sm:pl-0">
        <h3 className="font-semibold text-base sm:text-lg text-slate-900 line-clamp-2 group-hover:text-[#002B5B] transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-1">{course.instructor}</p>
        <p className="text-sm text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
          {snippet}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-slate-600">
          <span className="text-amber-600 font-medium tabular-nums">
            ★ {course.rating}
          </span>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {course.level}
          </span>
          <span className="text-slate-300" aria-hidden>
            |
          </span>
          <span className="font-semibold text-[#002B5B] tabular-nums">
            {formatPrice(course.price)}
          </span>
        </div>
      </div>
    </button>
  );
};
