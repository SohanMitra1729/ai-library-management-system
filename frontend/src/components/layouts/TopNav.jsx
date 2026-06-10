import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const TopNav = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-dark-900/50 backdrop-blur-md border-b border-dark-800 flex items-center justify-end px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-400 capitalize">{user?.role || 'student'}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
