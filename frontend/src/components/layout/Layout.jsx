import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <div className="z-50 bg-white border-b border-gray-100 flex-none sticky top-0">
        <Header />
      </div>

      <div className="flex flex-1">
        {currentUser && (
          <aside
            className={`transition-all duration-300 ease-in-out bg-[#001E3C] flex-none min-h-[calc(100vh-80px)]
            ${isExpanded ? "w-64" : "w-20"}`}
          >
            <Sidebar
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </aside>
        )}

        <main
          className={`flex-1 overflow-y-auto custom-scrollbar ${
            currentUser ? "p-6" : "px-6 py-6"
          }`}
        >
          <div
            className={`w-full ${
              currentUser ? "max-w-400 mx-auto" : "max-w-7xl mx-auto"
            }`}
          >
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;