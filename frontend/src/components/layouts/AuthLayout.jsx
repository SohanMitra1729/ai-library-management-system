import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bgPrimary text-textPrimary font-sans relative overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.25] blur-[2px] mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-bgPrimary/80 backdrop-blur-[4px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/60 via-transparent to-bgPrimary"></div>
      </div>

      {/* Decorative glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-accentCyan/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accentBlue/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accentCyan to-accentBlue tracking-tight">
            NexusLib
          </h1>
          <p className="text-textSecondary font-bold uppercase tracking-widest text-sm">Your portal to infinite knowledge</p>
        </div>
        
        <div className="bg-cardBg backdrop-blur-xl border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accentCyan/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="relative z-10">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
