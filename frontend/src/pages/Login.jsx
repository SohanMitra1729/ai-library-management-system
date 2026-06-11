import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === 'librarian') {
        navigate('/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-textPrimary mb-8 text-center tracking-tight">Welcome Back</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary">
              <Mail size={18} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary">
              <Lock size={18} />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 rounded-[16px] font-bold text-bgPrimary bg-accentCyan hover:bg-white hover:text-accentCyan hover:shadow-[0_0_20px_rgba(0,212,200,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentCyan focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentCyan disabled:hover:text-bgPrimary mt-8"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-bold text-textSecondary">
        Don't have an account?{' '}
        <Link to="/register" className="text-accentCyan hover:text-white transition-colors">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
