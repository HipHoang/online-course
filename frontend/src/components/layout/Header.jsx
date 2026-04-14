import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../auth/AuthModal";
import { logoutUser } from "../../data/mockAuth";
import { courseService } from "../../services/courseService";

const Header = () => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const type = event.detail?.type || "login";
      setAuthType(type);
      setOpenModal(true);
    };

    window.addEventListener("openAuthModal", handleOpenAuthModal);

    return () => {
      window.removeEventListener("openAuthModal", handleOpenAuthModal);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await courseService.searchCourses({
          q: searchTerm,
          sort_by: "id",
          order: "asc",
        });
        setResults(data);
      } catch (error) {
        console.error("Lỗi tìm kiếm khóa học:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/";
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 min-w-fit">
          <div className="text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.2 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" />
            </svg>
          </div>

          <div className="flex flex-col leading-tight">
            <span className="text-3xl font-black text-[#002B5B] tracking-tight">
              OU
            </span>
            <span className="text-2xl font-bold text-[#002B5B] tracking-tight">
              Education
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-6 relative" ref={searchRef}>
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowResults(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && results.length > 0) {
                  setShowResults(false);
                  navigate(`/courses/${results[0].id}`);
                  setSearchTerm("");
                }
              }}
              placeholder="Tìm kiếm khóa học, bài viết..."
              className="w-full py-3 pl-14 pr-4 bg-[#F0F2F5] border border-transparent rounded-full focus:bg-white focus:border-[#002B5B] focus:ring-1 focus:ring-[#002B5B] outline-none transition-all text-base"
            />

            {isSearching && (
              <span className="absolute inset-y-0 right-4 flex items-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </span>
            )}
          </div>

          {showResults && searchTerm && (
            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-gray-500 text-center">
                  Đang tìm kiếm...
                </div>
              ) : results.length > 0 ? (
                <ul>
                  {results.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setShowResults(false);
                        setSearchTerm("");
                        navigate(`/courses/${item.id}`);
                      }}
                      className="px-6 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center group transition-colors"
                    >
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-blue-600">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.topic || item.category || item.description || "Khóa học"}
                        </p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-gray-500 text-center">
                  Không tìm thấy kết quả cho "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>

        {!currentUser ? (
          <div className="flex items-center gap-4 min-w-fit">
            <button
              onClick={() => {
                setAuthType("login");
                setOpenModal(true);
              }}
              className="px-6 py-2.5 text-base font-semibold text-gray-700 hover:text-[#002B5B] transition-colors"
            >
              Đăng nhập
            </button>

            <button
              onClick={() => {
                setAuthType("register");
                setOpenModal(true);
              }}
              className="px-6 py-2.5 text-base font-semibold text-white bg-[#013396] rounded-full hover:bg-[#002B5B] shadow-md transition-all active:scale-95"
            >
              Đăng ký
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-5 min-w-fit">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#002B5B] text-white flex items-center justify-center font-bold text-lg">
                  {currentUser.avatar || currentUser.fullName?.slice(0, 2)}
                </div>

                <div className="text-left hidden md:block">
                  <p className="font-semibold text-[#0f172a] leading-tight">
                    {currentUser.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentUser.role === "teacher" ? "Giảng viên" : "Học viên"}
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden z-50">
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm">
                    Hồ sơ cá nhân
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm">
                    Cài đặt tài khoản
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {openModal && (
        <AuthModal
          type={authType}
          onClose={() => setOpenModal(false)}
          onSwitchType={(newType) => setAuthType(newType)}
        />
      )}
    </>
  );
};

export default Header;