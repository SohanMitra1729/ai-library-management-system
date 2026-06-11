import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans relative">
      {/* Global Bookshelf Background - Subtle & Blurred */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute inset-[-5%] bg-cover bg-center opacity-[0.12] blur-[10px] mix-blend-luminosity scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-slate-950"></div>
      </div>

      <div className="relative z-10 flex w-full h-full">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-900/40 backdrop-blur-3xl rounded-tl-3xl border-l border-t border-slate-700/50 my-2 mr-2 shadow-2xl">
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
