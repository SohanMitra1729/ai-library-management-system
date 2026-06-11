import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050810] flex flex-col items-center justify-center p-6 text-gray-200 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80')] bg-cover bg-center mix-blend-luminosity opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/40 via-[#050810]/80 to-[#050810] pointer-events-none"></div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="w-24 h-24 bg-primary-500/10 border border-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
          <Compass className="text-primary-400" size={48} />
        </div>
        <h1 className="text-7xl font-bold text-white mb-4 tracking-tighter drop-shadow-lg">404</h1>
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-10 text-lg">
          The page you are looking for has been moved, deleted, or possibly never existed.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-200 text-dark-900 font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:-translate-y-1"
        >
          <Home size={20} /> Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
