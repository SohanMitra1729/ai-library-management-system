import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Book, Users, BookUp, DollarSign, Loader2, BookOpenCheck, Calendar, Clock, Download, TrendingUp, Activity, CheckCircle2, AlertCircle, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-1 hover:border-white/20 transition-all duration-300 group relative overflow-hidden"
  >
    {/* Subtle glow inside card */}
    <div className={`absolute top-0 right-0 w-32 h-32 ${color.split(' ')[0].replace('bg-', 'bg-')}/20 rounded-full blur-[40px] pointer-events-none transition-opacity duration-300 opacity-50 group-hover:opacity-100`}></div>
    
    <div className="flex items-center justify-between relative z-10">
      <div>
        <p className="text-slate-300 text-sm font-medium mb-1 tracking-wide uppercase">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-white/10`}>
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
        const [statsRes, chartsRes, resCountRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/charts'),
          api.get('/reservations/active-count')
        ]);
        setStats({ ...statsRes.data, active_reservations: resCountRes.data.count });
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
    <div className="relative min-h-[80vh] rounded-[32px] overflow-hidden bg-bgPrimary border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Dashboard Library Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        {/* Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative border border-white/10 rounded-[32px] p-10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-cardBgGlass backdrop-blur-[18px]"
        >
          <div className="absolute right-0 top-0 w-96 h-96 bg-accentCyan/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-textPrimary mb-3 tracking-tight">Welcome back to Nexus<span className="text-accentCyan">Lib</span></h1>
            <p className="text-textSecondary text-lg md:text-xl font-medium max-w-2xl bg-bgSecondary/40 p-2 rounded-lg inline-block backdrop-blur-md border border-white/5">Your digital library command center. Overviewing performance, outstanding issues, and live availability.</p>
          </div>
          <div className="hidden md:block">
            <div className="p-5 bg-accentCyan/10 backdrop-blur-md rounded-2xl border border-accentCyan/20 shadow-lg">
              <Book className="text-accentCyan w-12 h-12" />
            </div>
          </div>
        </div>
      </motion.div>

        {/* Export Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={() => handleExport('books')} className="flex-1 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 text-slate-200 font-bold shadow-lg hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1">
            <Download size={20} className="text-teal-400" /> Export Books
          </button>
          <button onClick={() => handleExport('users')} className="flex-1 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 text-slate-200 font-bold shadow-lg hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1">
            <Download size={20} className="text-purple-400" /> Export Users
          </button>
          <button onClick={() => handleExport('transactions')} className="flex-1 bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300 text-slate-200 font-bold shadow-lg hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:-translate-y-1">
            <Download size={20} className="text-orange-400" /> Export Transactions
          </button>
        </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard title="Total Books" value={stats?.total_books || 0} icon={Book} color="bg-accentBlue/80 shadow-accentBlue/20" delay={0.1} />
        <StatCard title="Available" value={stats?.available_books || 0} icon={BookOpenCheck} color="bg-accentCyan/80 shadow-accentCyan/20" delay={0.2} />
        <StatCard title="Issued" value={stats?.active_issues || 0} icon={BookUp} color="bg-accentOrange/80 shadow-accentOrange/20" delay={0.3} />
        <StatCard title="Reservations" value={stats?.active_reservations || 0} icon={Bookmark} color="bg-accentPurple/80 shadow-accentPurple/20" delay={0.35} />
        <StatCard title="Active Users" value={stats?.total_users || 0} icon={Users} color="bg-accentPurple/80 shadow-accentPurple/20" delay={0.4} />
        <StatCard title="Pending Fines" value={`₹${stats?.total_unpaid_fines || 0}`} icon={DollarSign} color="bg-red-500/80 shadow-red-500/20" delay={0.5} />
      </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 flex items-center gap-4 hover:bg-white/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-red-500/10 rounded-full blur-[30px] group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-full relative z-10"><Clock className="text-red-400" size={24} /></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-textPrimary">{stats?.overdue_books || 0}</h4>
              <p className="text-sm font-medium text-textSecondary">Overdue Books</p>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 flex items-center gap-4 hover:bg-white/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-accentCyan/10 rounded-full blur-[30px] group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <div className="p-3 bg-accentCyan/20 border border-accentCyan/30 rounded-full relative z-10"><Calendar className="text-accentCyan" size={24} /></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-textPrimary">{stats?.returned_today || 0}</h4>
              <p className="text-sm font-medium text-textSecondary">Books Returned Today</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 flex items-center gap-4 hover:bg-white/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-green-500/10 rounded-full blur-[30px] group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-full relative z-10"><DollarSign className="text-green-400" size={24} /></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-textPrimary">₹{stats?.collected_fines || 0}</h4>
              <p className="text-sm font-medium text-textSecondary">Collected Fines</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 flex items-center gap-4 hover:bg-white/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-accentBlue/10 rounded-full blur-[30px] group-hover:opacity-100 opacity-50 transition-opacity"></div>
            <div className="p-3 bg-accentBlue/20 border border-accentBlue/30 rounded-full relative z-10"><DollarSign className="text-accentBlue" size={24} /></div>
            <div className="relative z-10">
              <h4 className="text-2xl font-bold text-textPrimary">₹{stats?.total_fines || 0}</h4>
              <p className="text-sm font-medium text-textSecondary">Total Fines Generated</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Books By Category (Pie Chart) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
            className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accentCyan/5 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-lg font-bold text-textPrimary mb-6">Books by Category</h3>
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
            className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accentBlue/5 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="text-lg font-bold text-textPrimary mb-6">Availability Overview</h3>
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
            className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-xl lg:col-span-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accentPurple/5 rounded-full blur-[100px] pointer-events-none"></div>
          <h3 className="text-lg font-bold text-textPrimary mb-6">Monthly Borrowing Activity</h3>
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
            className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-xl lg:col-span-2 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accentCyan/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="text-accentCyan" size={24} />
            <h3 className="text-lg font-bold text-textPrimary">Top 5 Most Issued Books</h3>
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
            className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] p-6 shadow-xl lg:col-span-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-accentOrange/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-accentCyan" size={24} />
            <h3 className="text-lg font-bold text-textPrimary">Recent Library Activity</h3>
          </div>
          <div className="space-y-4">
            {charts.recentActivity && charts.recentActivity.length > 0 ? (
              charts.recentActivity.map((act, i) => (
                <div key={i} className="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-black/40 hover:-translate-y-1 hover:shadow-lg">
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
    </div>
  );
};

export default Dashboard;
