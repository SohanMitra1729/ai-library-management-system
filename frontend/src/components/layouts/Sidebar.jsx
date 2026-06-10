import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, BookUp, BookDown, LogOut, Sparkles, History, Library, Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isLibrarian, logout } = useAuth();

  const navLinks = [
    { to: '/catalog', icon: BookOpen, label: 'Books Catalog' },
    { to: '/recommendations', icon: Sparkles, label: 'AI Recommendations' },
    ...(!isLibrarian
      ? [{ to: '/my-books', icon: Bookmark, label: 'My Books' }]
      : []),
    ...(isLibrarian
      ? [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/add-book', icon: PlusCircle, label: 'Add Book' },
        { to: '/issue-book', icon: BookUp, label: 'Issue Book' },
        { to: '/return-book', icon: BookDown, label: 'Return Book' },
        { to: '/issue-history', icon: History, label: 'Issue History' },
      ]
      : []),
  ];

  return (
    <div className="w-64 bg-[#050810]/30 backdrop-blur-xl flex flex-col min-h-screen relative z-20 border-r border-dark-700/50 shadow-[10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Sidebar Texture */}
      <div 
        className="absolute inset-0 bg-cover bg-left opacity-30 pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/40 to-[#050810]/80 pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-gradient-to-br from-primary-500 to-blue-600 rounded-xl shadow-[0_0_20px_rgba(56,189,248,0.7)] border border-white/20">
          <Library className="text-white drop-shadow-lg" size={24} />
        </div>
        <h2 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-md">
          Nexus<span className="text-primary-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)]">Lib</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden group ${isActive
                  ? 'text-white bg-white/10 font-medium shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-white/5'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-[0_0_12px_rgba(56,189,248,1)]"></div>
                  )}
                  <Icon 
                    size={20} 
                    className={`transition-all duration-300 ${isActive ? 'text-primary-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : 'group-hover:text-primary-500/70 group-hover:drop-shadow-[0_0_5px_rgba(56,189,248,0.4)]'}`} 
                  />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-dark-800 hover:text-red-400 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
