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
    <div className="w-64 bg-slate-900/80 backdrop-blur-2xl flex flex-col min-h-screen relative z-20 border-r border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
      {/* Sidebar Texture - Minimal */}
      <div 
        className="absolute inset-0 bg-cover bg-left opacity-10 pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-slate-950/90 pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl shadow-lg border border-teal-400/30">
          <Library className="text-white drop-shadow-md" size={24} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
          Nexus<span className="text-teal-400">Lib</span>
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${isActive
                  ? 'text-white bg-teal-500/10 font-bold border border-teal-500/20 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_8px_rgba(20,184,166,0.8)]"></div>
                  )}
                  <Icon 
                    size={20} 
                    className={`transition-all duration-300 ${isActive ? 'text-teal-400' : 'group-hover:text-slate-300'}`} 
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
          className="flex items-center justify-center gap-3 w-full px-4 py-3 font-bold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all duration-300 shadow-sm hover:shadow-[0_4px_14px_rgba(239,68,68,0.4)]"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
