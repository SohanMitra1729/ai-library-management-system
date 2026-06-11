import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, BookUp, BookDown, Sparkles, History, Library, Bookmark, BookmarkPlus, DollarSign, BrainCircuit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { isLibrarian } = useAuth();

  const navLinks = [
    { to: '/catalog', icon: BookOpen, label: 'Books Catalog' },
    { to: '/recommendations', icon: Sparkles, label: 'AI Recommendations' },
    { to: '/study-planner', icon: BrainCircuit, label: 'AI Study Planner' },
    ...(!isLibrarian
      ? [
          { to: '/my-books', icon: Bookmark, label: 'My Books' },
          { to: '/my-reservations', icon: BookmarkPlus, label: 'My Reservations' },
          { to: '/my-fines', icon: DollarSign, label: 'My Fines' }
        ]
      : []),
    ...(isLibrarian
      ? [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/manage-reservations', icon: Bookmark, label: 'Manage Reservations' },
        { to: '/add-book', icon: PlusCircle, label: 'Add Book' },
        { to: '/issue-book', icon: BookUp, label: 'Issue Book' },
        { to: '/return-book', icon: BookDown, label: 'Return Book' },
        { to: '/issue-history', icon: History, label: 'Issue History' },
        { to: '/fines', icon: DollarSign, label: 'Fines' },
      ]
      : []),
  ];

  return (
    <div className="w-64 bg-cardBgGlass backdrop-blur-[18px] flex flex-col min-h-screen relative z-20 border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300">
      {/* Sidebar Texture - Minimal */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.5] pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-bgSecondary/40 to-bgPrimary/70 pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-gradient-to-br from-accentCyan to-accentBlue rounded-xl shadow-[0_0_15px_rgba(0,212,200,0.5)] border border-accentCyan/30">
          <Library className="text-white drop-shadow-md" size={24} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
          Nexus<span className="text-accentCyan">Lib</span>
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
                  ? 'bg-accentCyan/15 text-accentCyan shadow-[inset_4px_0_0_0_rgba(0,212,200,1)] bg-gradient-to-r from-accentCyan/10 to-transparent'
                  : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accentCyan rounded-r-full shadow-[0_0_8px_rgba(0,212,200,0.8)]"></div>
                  )}
                  <Icon 
                    size={20} 
                    className={`transition-all duration-300 ${isActive ? 'text-accentCyan' : 'group-hover:text-textPrimary'}`} 
                  />
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
};

export default Sidebar;
