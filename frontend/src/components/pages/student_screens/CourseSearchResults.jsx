import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { courseService } from "../../../services/courseService";
import { CourseListRow } from "./CourseCard";

const PAGE_SIZE = 10;

const TOPIC_OPTIONS = [
  { label: "Tất cả chủ đề", value: "" },
  { label: "Web / Lập trình", value: "Web" },
  { label: "React", value: "React" },
  { label: "HTML", value: "HTML" },
];

const PRICE_OPTIONS = [
  { label: "Mọi mức giá", value: "" },
  { label: "Miễn phí", value: "true" },
  { label: "Trả phí", value: "false" },
];

const RATING_OPTIONS = [
  { label: "Mọi đánh giá", value: "" },
  { label: "Từ 4★", value: "4" },
  { label: "Từ 4.5★", value: "4.5" },
];

const SORT_OPTIONS = [
  { label: "Mới nhất", sort_by: "id", order: "desc" },
  { label: "Cũ nhất", sort_by: "id", order: "asc" },
  { label: "Giá tăng dần", sort_by: "price", order: "asc" },
  { label: "Giá giảm dần", sort_by: "price", order: "desc" },
  { label: "Đánh giá cao", sort_by: "rating", order: "desc" },
];

const triggerClass =
  "inline-flex items-center gap-1.5 max-w-full pl-3.5 pr-2.5 py-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors";

const menuClass =
  "absolute left-0 top-[calc(100%+6px)] min-w-[11.5rem] max-h-64 overflow-y-auto rounded-xl border border-neutral-200 bg-white py-1 z-50";

const menuItemClass =
  "w-full text-left px-3.5 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 transition-colors";

const menuItemActiveClass = "bg-neutral-100 font-medium";

function FilterDropdown({
  id,
  label,
  summary,
  open,
  onToggle,
  onClose,
  children,
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, onClose]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={onToggle}
        className={triggerClass}
      >
        <span className="truncate">
          <span className="text-neutral-500 font-normal">{label}</span>
          <span className="mx-1 text-neutral-300">·</span>
          <span>{summary}</span>
        </span>
        <FiChevronDown
          className={`shrink-0 w-4 h-4 text-neutral-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className={menuClass} role="listbox">{children}</div>}
    </div>
  );
}

const CourseSearchResults = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = (searchParams.get("q") || "").trim();
  const topic = searchParams.get("topic") || "";
  const isFreeRaw = searchParams.get("is_free");
  const ratingRaw = searchParams.get("rating");
  const sortBy = searchParams.get("sort_by") || "id";
  const order = searchParams.get("order") || "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);

  const [filtersBarVisible, setFiltersBarVisible] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({
    page: 1,
    size: PAGE_SIZE,
    total: 0,
    total_pages: 0,
    results: [],
  });

  const closeMenus = useCallback(() => setOpenMenu(null), []);

  const apiParams = useMemo(() => {
    const params = {
      page,
      size: PAGE_SIZE,
      sort_by: sortBy,
      order,
    };
    if (q) params.q = q;
    if (topic) params.topic = topic;
    if (isFreeRaw === "true" || isFreeRaw === "false") {
      params.is_free = isFreeRaw === "true";
    }
    if (ratingRaw) {
      const r = parseFloat(ratingRaw);
      if (!Number.isNaN(r)) params.rating = r;
    }
    return params;
  }, [q, topic, isFreeRaw, ratingRaw, sortBy, order, page]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!q) {
        setPageData({
          page: 1,
          size: PAGE_SIZE,
          total: 0,
          total_pages: 0,
          results: [],
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await courseService.searchCoursesPaged(apiParams);
        if (!cancelled) setPageData(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setPageData({
            page: 1,
            size: PAGE_SIZE,
            total: 0,
            total_pages: 0,
            results: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [apiParams]);

  const patchParams = useCallback(
    (updates, { resetPage = true } = {}) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      if (resetPage) next.set("page", "1");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const goPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(Math.max(1, p)));
    setSearchParams(next);
  };

  const sortMatches = (opt) => opt.sort_by === sortBy && opt.order === order;
  const currentSort = SORT_OPTIONS.find(sortMatches) || SORT_OPTIONS[0];
  const topicSummary =
    TOPIC_OPTIONS.find((o) => o.value === topic)?.label || "Tất cả chủ đề";
  const priceSummary =
    PRICE_OPTIONS.find((o) => o.value === (isFreeRaw || ""))?.label ||
    "Mọi mức giá";
  const ratingSummary =
    RATING_OPTIONS.find((o) => o.value === (ratingRaw || ""))?.label ||
    "Mọi đánh giá";

  const totalPages = pageData.total_pages || 0;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="flex items-start gap-3 mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 px-2 py-1.5 -ml-1 rounded-full text-sm text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/80 transition-colors"
        >
          <FiArrowLeft className="text-base" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      </div>

      {q ? (
        <p className="text-sm text-neutral-600 mb-1">
          Kết quả cho:{" "}
          <span className="font-semibold text-neutral-900">{q}</span>
          {!loading && pageData.total > 0 ? (
            <span className="text-neutral-400 font-normal">
              {" "}
              · {pageData.total} khóa học
            </span>
          ) : null}
        </p>
      ) : (
        <p className="text-sm text-neutral-500 mb-1">
          Dùng ô tìm kiếm trên cùng, sau đó nhấn Enter để xem kết quả tại đây.
        </p>
      )}

      {filtersBarVisible && (
        <div
          className="sticky top-0 z-30 -mx-1 px-1 py-2.5 mb-4 flex flex-wrap items-center gap-2 bg-[#F8FAFC]/95 backdrop-blur-sm border-b border-neutral-200/60"
          id="search-filter-bar"
        >
          <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
            <FilterDropdown
              id="filter-topic"
              label="Chủ đề"
              summary={topicSummary}
              open={openMenu === "topic"}
              onToggle={() =>
                setOpenMenu((m) => (m === "topic" ? null : "topic"))
              }
              onClose={closeMenus}
            >
              {TOPIC_OPTIONS.map((opt) => (
                <button
                  key={opt.value || "all"}
                  type="button"
                  role="option"
                  className={`${menuItemClass} ${
                    (topic || "") === opt.value ? menuItemActiveClass : ""
                  }`}
                  onClick={() => {
                    patchParams({ topic: opt.value || null });
                    closeMenus();
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </FilterDropdown>

            <FilterDropdown
              id="filter-price"
              label="Giá"
              summary={priceSummary}
              open={openMenu === "price"}
              onToggle={() =>
                setOpenMenu((m) => (m === "price" ? null : "price"))
              }
              onClose={closeMenus}
            >
              {PRICE_OPTIONS.map((opt) => (
                <button
                  key={opt.value || "all"}
                  type="button"
                  role="option"
                  className={`${menuItemClass} ${
                    (isFreeRaw || "") === opt.value ? menuItemActiveClass : ""
                  }`}
                  onClick={() => {
                    patchParams({
                      is_free:
                        opt.value === ""
                          ? null
                          : opt.value === "true"
                            ? "true"
                            : "false",
                    });
                    closeMenus();
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </FilterDropdown>

            <FilterDropdown
              id="filter-rating"
              label="Đánh giá"
              summary={ratingSummary}
              open={openMenu === "rating"}
              onToggle={() =>
                setOpenMenu((m) => (m === "rating" ? null : "rating"))
              }
              onClose={closeMenus}
            >
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value || "all"}
                  type="button"
                  role="option"
                  className={`${menuItemClass} ${
                    (ratingRaw || "") === opt.value ? menuItemActiveClass : ""
                  }`}
                  onClick={() => {
                    patchParams({ rating: opt.value ? opt.value : null });
                    closeMenus();
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </FilterDropdown>

            <FilterDropdown
              id="filter-sort"
              label="Sắp xếp"
              summary={currentSort.label}
              open={openMenu === "sort"}
              onToggle={() =>
                setOpenMenu((m) => (m === "sort" ? null : "sort"))
              }
              onClose={closeMenus}
            >
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  role="option"
                  className={`${menuItemClass} ${
                    sortMatches(opt) ? menuItemActiveClass : ""
                  }`}
                  onClick={() => {
                    patchParams({ sort_by: opt.sort_by, order: opt.order });
                    closeMenus();
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </FilterDropdown>
          </div>

          <button
            type="button"
            onClick={() => setFiltersBarVisible(false)}
            aria-expanded="true"
            aria-label="Ẩn thanh bộ lọc"
            title="Ẩn bộ lọc"
            className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <HiAdjustmentsHorizontal className="w-5 h-5" />
          </button>
        </div>
      )}

      {!filtersBarVisible && (
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setFiltersBarVisible(true)}
            aria-expanded="false"
            aria-label="Hiện thanh bộ lọc"
            title="Hiện bộ lọc"
            className="inline-flex items-center gap-2 pl-3 pr-3 py-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-900 hover:bg-neutral-50 transition-colors"
          >
            <HiAdjustmentsHorizontal className="w-5 h-5" />
            Bộ lọc
          </button>
        </div>
      )}

      {!q ? (
        <p className="text-sm text-neutral-500 py-10 text-center">
          Chưa có từ khóa. Mở thanh tìm phía trên, nhập nội dung và Enter.
        </p>
      ) : loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Đang tải">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-4 py-4 border-b border-neutral-100 animate-pulse"
            >
              <div className="w-full sm:max-w-[20rem] sm:w-72 aspect-video rounded-lg bg-neutral-200 shrink-0" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-5 bg-neutral-200 rounded w-3/4" />
                <div className="h-4 bg-neutral-100 rounded w-1/3" />
                <div className="h-4 bg-neutral-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : pageData.results.length === 0 ? (
        <p className="text-sm text-neutral-500 py-12 text-center">
          Không tìm thấy khóa học phù hợp. Thử đổi từ khóa hoặc nới bộ lọc.
        </p>
      ) : (
        <>
          <ul className="list-none p-0 m-0 divide-y divide-neutral-100">
            {pageData.results.map((course) => (
              <li key={course.id} className="py-1">
                <CourseListRow
                  course={course}
                  onSelect={(id) => navigate(`/courses/${id}`)}
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 pt-8"
              aria-label="Phân trang"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goPage(page - 1)}
                className="px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-sm text-neutral-500 tabular-nums px-2">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goPage(page + 1)}
                className="px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 transition-colors disabled:opacity-35 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default CourseSearchResults;
