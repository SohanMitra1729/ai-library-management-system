import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Settings } from 'lucide-react';

const TopNav = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-bgSecondary/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-end px-8 sticky top-0 z-10 transition-all gap-6">
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-textSecondary hover:text-accentCyan hover:bg-white/5 rounded-full transition-all relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accentOrange rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
        </button>
        <button className="p-2.5 text-textSecondary hover:text-accentCyan hover:bg-white/5 rounded-full transition-all">
          <Settings size={20} />
        </button>
      </div>

      <div className="h-8 w-[1px] bg-white/10"></div>

      <div className="flex items-center gap-4 bg-cardBg p-2 pr-4 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
        <div className="h-10 w-10 rounded-full bg-accentCyan/10 border border-accentCyan/30 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan group-hover:text-bgPrimary transition-all shadow-sm">
          <User size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-textPrimary leading-tight">{user?.name || 'User'}</p>
          <p className="text-[11px] font-medium text-accentCyan capitalize">{user?.role || 'student'}</p>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
