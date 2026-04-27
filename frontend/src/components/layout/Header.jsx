import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "../auth/AuthModal";
import { isTeacherRole } from "../../untils/auth";
import { useAuth } from "../../context/AuthProvider";

const Header = () => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userMenuRef = useRef(null);

  const { user, clearStoredAuth } = useAuth();

  const role = user?.role;
  const isTeacher = isTeacherRole(role);

  const handleSearch = (value) => {
    const keyword = value?.trim();
    if (!keyword) return;
    navigate(`/all-courses?q=${encodeURIComponent(keyword)}`);
  };

  useEffect(() => {
    const handleOpenAuthModal = (event) => {
      const type = event.detail?.type || "login";
      setAuthType(type);
      setOpenModal(true);
    };

    window.addEventListener("openAuthModal", handleOpenAuthModal);
    return () => window.removeEventListener("openAuthModal", handleOpenAuthModal);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearStoredAuth();
    window.location.href = "/";
  };

  const displayName = user?.name || user?.fullName || "Người dùng";
  const avatarText = displayName.trim().charAt(0).toUpperCase() || "U";

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div
          className="flex items-center gap-3 min-w-fit cursor-pointer"
          onClick={() => navigate(isTeacher ? "/teacher/dashboard" : "/")}
        >
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

        <div className="flex-1 max-w-2xl mx-6 relative">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchTerm);
                }
              }}
              placeholder={
                isTeacher
                  ? "Tìm kiếm học viên, khóa học..."
                  : "Tìm kiếm khóa học..."
              }
              className="w-full py-3 pl-14 pr-14 bg-[#F0F2F5] border border-transparent rounded-full focus:bg-white focus:border-[#002B5B] focus:ring-1 focus:ring-[#002B5B] outline-none transition-all text-base"
            />

            <button
              onClick={() => handleSearch(searchTerm)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600"
            >
              🔍
            </button>
          </div>
        </div>

        {!user ? (
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
                  strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1.5 rounded-2xl transition"
              >
                <div className="w-11 h-11 rounded-full bg-[#2F63D8] text-white flex items-center justify-center font-bold text-lg">
                  {avatarText}
                </div>

                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-tight">
                    {displayName}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isTeacher ? "Giảng viên" : "Học viên"}
                  </p>
                </div>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
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
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate(isTeacher ? "/teacher/profile" : "/settings");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 transition"
                  >
                    {isTeacher ? "Hồ sơ giảng viên" : "Thông tin tài khoản"}
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate(isTeacher ? "/teacher/settings" : "/settings");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-gray-50 transition"
                  >
                    Cài đặt
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
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
          onSwitchType={(type) => setAuthType(type)}
        />
      )}
    </>
  );
};

export default Header;
