import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';

const TopNav = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-bgSecondary/60 backdrop-blur-2xl border-b border-white/5 flex items-center justify-end px-8 sticky top-0 z-50 transition-all gap-6">
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

      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-4 bg-cardBg p-2 pr-4 rounded-full border border-white/10 hover:bg-white/5 transition-all duration-300 cursor-pointer group shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          <div className="h-10 w-10 rounded-full bg-accentCyan/10 border border-accentCyan/30 flex items-center justify-center text-accentCyan group-hover:bg-accentCyan group-hover:text-bgPrimary transition-all shadow-sm">
            <User size={20} />
          </div>
          <div className="text-left flex items-center gap-3">
            <div>
              <p className="text-sm font-bold text-textPrimary leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] font-medium text-accentCyan capitalize">{user?.role || 'student'}</p>
            </div>
            <ChevronDown size={16} className={`text-textSecondary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-cardBgGlass border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden py-2 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2 z-[9999]">
            <div className="px-4 py-3 border-b border-white/5 mb-1">
              <p className="text-sm font-bold text-textPrimary truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-textSecondary truncate">{user?.email || ''}</p>
            </div>
            
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-textSecondary hover:text-accentCyan hover:bg-white/5 transition-colors text-left">
              <User size={16} />
              Profile
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-textSecondary hover:text-accentCyan hover:bg-white/5 transition-colors text-left">
              <Settings size={16} />
              Settings
            </button>
            
            <div className="h-[1px] w-full bg-white/5 my-1"></div>
            
            <button 
              onClick={() => {
                setIsDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
