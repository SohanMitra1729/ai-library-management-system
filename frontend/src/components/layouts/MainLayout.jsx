import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-[#050810] text-gray-200 overflow-hidden font-sans relative">
      {/* Global Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-900/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative bg-black/20 backdrop-blur-3xl rounded-tl-3xl border-l border-t border-dark-700/50 my-2 mr-2 shadow-2xl">
          <TopNav />
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 relative">
            <div className="relative z-10 max-w-7xl mx-auto h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
