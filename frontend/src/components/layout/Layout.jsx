import React, { useState } from 'react';
import Sidebar from './SideBar';
import Header from './Header';


const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    
    <div className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden">
      
      <div className="z-70 bg-white border-b border-gray-100 flex-none">
        <Header />
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <aside 
          className={`transition-all duration-300 ease-in-out bg-[#001E3C] flex-none
          ${isExpanded ? 'w-64' : 'w-20'}`}
        >
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </aside>

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-350 mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;