import React, { useState } from "react";
import AuthModal from "../auth/AuthModal";

const Header = () => {
  const [openModal, setOpenModal] = useState(false);
  const [authType, setAuthType] = useState("login");

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
        
        {/* 1. Logo Section */}
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"   // tăng icon
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

        {/* 2. Search Bar Section */}
        <div className="flex-1 max-w-2xl mx-10">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"   // icon to hơn
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
              placeholder="Tìm kiếm khóa học, bài viết..."
              className="w-full py-3 pl-14 pr-4 bg-[#F0F2F5] border border-transparent rounded-full focus:bg-white focus:border-[#002B5B] focus:ring-1 focus:ring-[#002B5B] outline-none transition-all text-base"
            />
          </div>
        </div>

        {/* 3. Actions Section */}
        <div className="flex items-center gap-5">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"   // icon to hơn
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

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

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
            className="px-6 py-2.5 text-base font-semibold text-white bg-[#002B5B] rounded-full hover:bg-[#003a78] shadow-md transition-all active:scale-95"
          >
            Đăng ký
          </button>
        </div>
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