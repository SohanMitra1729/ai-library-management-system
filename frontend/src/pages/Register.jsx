import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User, Briefcase, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await register(name, email, password, role);
      if (userData.role === 'librarian') {
        navigate('/dashboard');
      } else {
        navigate('/catalog');
      }
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-black text-textPrimary mb-8 text-center tracking-tight">Create Account</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-[16px] mb-6 text-sm font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary">
              <User size={18} />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue/50 transition-all shadow-inner"
              placeholder="John Doe"
            />
          </div>
        </div>

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
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue/50 transition-all shadow-inner"
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
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue/50 transition-all shadow-inner"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSecondary">
              <Briefcase size={18} />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue/50 transition-all appearance-none shadow-inner custom-select"
            >
              <option value="student" className="bg-bgPrimary text-textPrimary">Student</option>
              <option value="faculty" className="bg-bgPrimary text-textPrimary">Faculty</option>
              <option value="librarian" className="bg-bgPrimary text-textPrimary">Librarian</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center py-4 px-4 rounded-[16px] font-bold text-bgPrimary bg-accentBlue hover:bg-white hover:text-accentBlue hover:shadow-[0_0_20px_rgba(30,144,255,0.6)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentBlue focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentBlue disabled:hover:text-bgPrimary mt-8"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
        </button>
      </form>

      <p className="mt-8 text-center text-sm font-bold text-textSecondary">
        Already have an account?{' '}
        <Link to="/login" className="text-accentBlue hover:text-white transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
