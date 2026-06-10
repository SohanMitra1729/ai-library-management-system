import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Book, Users, BookUp, DollarSign, Loader2, BookOpenCheck, Calendar, Clock, Download, TrendingUp, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-dark-800/50 backdrop-blur-md border border-dark-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white" size={24} />
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState({ booksByCategory: [], monthlyActivity: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartsRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/charts')
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-primary-500" size={48} />
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ffc658', '#ef5350', '#ab47bc'];

  const handleExport = async (type) => {
    try {
      const response = await api.get(`/dashboard/export/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative border border-primary-500/30 rounded-3xl p-10 overflow-hidden shadow-2xl"
      >
        {/* Background Image with Overlays */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        ></div>
        {/* Reduced dark overlay from 80% to 40% */}
        <div className="absolute inset-0 bg-[#050810]/40 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/70 to-transparent"></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary-500/40 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">Welcome back to Nexus<span className="text-primary-400">Lib</span></h1>
            <p className="text-gray-100 text-lg md:text-xl font-medium max-w-2xl drop-shadow-md bg-black/20 p-2 rounded-lg inline-block backdrop-blur-sm">Your digital library command center. Overviewing performance, outstanding issues, and live availability.</p>
          </div>
          <div className="hidden md:block">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <Book className="text-white w-16 h-16 drop-shadow-lg" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Export Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <button onClick={() => handleExport('books')} className="flex-1 bg-dark-800/50 hover:bg-dark-700 border border-dark-600 rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors text-white font-medium shadow-lg hover:shadow-primary-500/10">
          <Download size={20} className="text-primary-400" /> Export Books CSV
        </button>
        <button onClick={() => handleExport('users')} className="flex-1 bg-dark-800/50 hover:bg-dark-700 border border-dark-600 rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors text-white font-medium shadow-lg hover:shadow-purple-500/10">
          <Download size={20} className="text-purple-400" /> Export Users CSV
        </button>
        <button onClick={() => handleExport('transactions')} className="flex-1 bg-dark-800/50 hover:bg-dark-700 border border-dark-600 rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors text-white font-medium shadow-lg hover:shadow-orange-500/10">
          <Download size={20} className="text-orange-400" /> Export Transactions CSV
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title="Total Books" value={stats?.total_books || 0} icon={Book} color="bg-blue-500/80 shadow-blue-500/20" delay={0.1} />
        <StatCard title="Available Books" value={stats?.available_books || 0} icon={BookOpenCheck} color="bg-teal-500/80 shadow-teal-500/20" delay={0.2} />
        <StatCard title="Issued Books" value={stats?.active_issues || 0} icon={BookUp} color="bg-orange-500/80 shadow-orange-500/20" delay={0.3} />
        <StatCard title="Active Users" value={stats?.total_users || 0} icon={Users} color="bg-purple-500/80 shadow-purple-500/20" delay={0.4} />
        <StatCard title="Total Fines" value={`₹${stats?.total_unpaid_fines || 0}`} icon={DollarSign} color="bg-red-500/80 shadow-red-500/20" delay={0.5} />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-dark-800/40 border border-dark-700/50 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-full"><Clock className="text-red-400" size={24} /></div>
          <div>
            <h4 className="text-2xl font-bold text-white">{stats?.overdue_books || 0}</h4>
            <p className="text-sm text-gray-400">Overdue Books</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-dark-800/40 border border-dark-700/50 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-teal-500/10 rounded-full"><Calendar className="text-teal-400" size={24} /></div>
          <div>
            <h4 className="text-2xl font-bold text-white">{stats?.returned_today || 0}</h4>
            <p className="text-sm text-gray-400">Books Returned Today</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-dark-800/40 border border-dark-700/50 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 rounded-full"><DollarSign className="text-orange-400" size={24} /></div>
          <div>
            <h4 className="text-2xl font-bold text-white">₹{stats?.total_unpaid_fines || 0}</h4>
            <p className="text-sm text-gray-400">Outstanding Fines</p>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Books By Category (Pie Chart) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
          className="bg-dark-800/40 border border-dark-700/50 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Books by Category</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            {charts.booksByCategory && charts.booksByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.booksByCategory} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                    {charts.booksByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                <Book className="mx-auto mb-2 opacity-50" size={32} />
                <p>No category data available yet.</p>
                <p className="text-xs mt-1">Add some books to see this chart.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Availability Overview (Bar Chart) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.0 }}
          className="bg-dark-800/40 border border-dark-700/50 rounded-3xl p-6"
        >
          <h3 className="text-lg font-bold text-white mb-6">Availability Overview</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            {stats && (stats.available_books > 0 || stats.active_issues > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Available', count: Number(stats?.available_books) || 0, fill: '#0ea5e9' },
                  { name: 'Issued', count: Number(stats?.active_issues) || 0, fill: '#f97316' }
                ]}>
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                <BookOpenCheck className="mx-auto mb-2 opacity-50" size={32} />
                <p>No availability data.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Monthly Borrowing Activity (Line Chart) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
          className="bg-dark-800/40 border border-dark-700/50 rounded-3xl p-6 lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-white mb-6">Monthly Borrowing Activity</h3>
          <div className="h-72 flex flex-col items-center justify-center">
            {charts.monthlyActivity && charts.monthlyActivity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="issues" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                <Calendar className="mx-auto mb-2 opacity-50" size={32} />
                <p>No borrowing activity recorded yet.</p>
                <p className="text-xs mt-1">Issue some books to see trends.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top 5 Most Issued Books (Bar Chart) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
          className="bg-dark-800/40 border border-dark-700/50 rounded-3xl p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-primary-400" size={24} />
            <h3 className="text-lg font-bold text-white">Top 5 Most Issued Books</h3>
          </div>
          <div className="h-72 flex flex-col items-center justify-center">
            {charts.topIssuedBooks && charts.topIssuedBooks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.topIssuedBooks} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis dataKey="title" type="category" width={150} stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="issue_count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-gray-500">
                <BookUp className="mx-auto mb-2 opacity-50" size={32} />
                <p>No issue data available.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          className="bg-dark-800/40 border border-dark-700/50 rounded-3xl p-6 lg:col-span-2"
        >
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-teal-400" size={24} />
            <h3 className="text-lg font-bold text-white">Recent Library Activity</h3>
          </div>
          <div className="space-y-4">
            {charts.recentActivity && charts.recentActivity.length > 0 ? (
              charts.recentActivity.map((act, i) => (
                <div key={i} className="bg-dark-900/50 border border-dark-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-dark-600">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg mt-1 ${act.status === 'issued' ? 'bg-blue-500/20 text-blue-400' : act.status === 'returned' ? 'bg-teal-500/20 text-teal-400' : 'bg-red-500/20 text-red-400'}`}>
                      {act.status === 'issued' ? <BookUp size={20} /> : act.status === 'returned' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <p className="text-white font-bold">{act.book_title}</p>
                      <p className="text-sm text-gray-400">by <span className="text-gray-300">{act.user_name}</span></p>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center text-sm w-full md:w-auto">
                    <span className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-wider ${act.status === 'issued' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : act.status === 'returned' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {act.status}
                    </span>
                    <span className="text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {act.status === 'returned' ? new Date(act.return_date).toLocaleDateString() : new Date(act.issue_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Activity className="mx-auto mb-2 opacity-50" size={32} />
                <p>No recent activity found.</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Dashboard;
