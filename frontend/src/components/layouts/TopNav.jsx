import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const TopNav = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-800 flex items-center justify-end px-8 sticky top-0 z-10 transition-all">
      <div className="flex items-center gap-4 bg-slate-800/40 p-2 pr-4 rounded-full border border-slate-700/50 hover:bg-slate-800/60 transition-colors cursor-pointer group">
        <div className="h-10 w-10 rounded-full bg-teal-500/20 border border-teal-500/50 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-sm">
          <User size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-200 leading-tight">{user?.name || 'User'}</p>
          <p className="text-[11px] font-medium text-slate-400 capitalize">{user?.role || 'student'}</p>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
