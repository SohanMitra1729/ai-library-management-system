import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-bgPrimary text-textPrimary overflow-hidden font-sans relative">

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative bg-bgSecondary/50 backdrop-blur-3xl rounded-tl-[2rem] border-l border-t border-white/5 my-2 mr-2 shadow-[-10px_-10px_30px_rgba(0,0,0,0.5)]">
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
