import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bgPrimary flex flex-col items-center justify-center p-6 text-textSecondary font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.15] blur-[2px] mix-blend-luminosity"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-bgPrimary/80 backdrop-blur-[4px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/60 via-transparent to-bgPrimary"></div>
      </div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 bg-accentCyan/10 border border-accentCyan/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(0,212,200,0.15)]">
          <Compass className="text-accentCyan" size={48} />
        </div>
        <h1 className="text-7xl font-black text-textPrimary mb-4 tracking-tighter drop-shadow-lg">404</h1>
        <h2 className="text-2xl font-black text-textPrimary mb-4">Page Not Found</h2>
        <p className="text-textSecondary mb-10 text-lg font-medium">
          The page you are looking for has been moved, deleted, or possibly never existed.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accentCyan hover:bg-white text-bgPrimary hover:text-accentCyan font-bold rounded-[16px] transition-all duration-300 shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:shadow-[0_0_30px_rgba(0,212,200,0.6)]"
        >
          <Home size={20} /> Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
