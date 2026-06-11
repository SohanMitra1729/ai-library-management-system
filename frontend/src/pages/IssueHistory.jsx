import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { History, Search, Filter, Loader2, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const IssueHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/issue/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching issue history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'returned':
        return <span className="px-3 py-1 bg-accentCyan/10 text-accentCyan border border-accentCyan/20 rounded-full text-xs font-bold tracking-wide uppercase">Returned</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold tracking-wide uppercase">Overdue</span>;
      default:
        return <span className="px-3 py-1 bg-accentBlue/10 text-accentBlue border border-accentBlue/20 rounded-full text-xs font-bold tracking-wide uppercase">Issued</span>;
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.issue_id.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || item.dynamic_status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Global background handles library theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549675584-91f19337af3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-textPrimary flex items-center gap-3 tracking-tight">
            <History className="text-accentCyan" size={32} />
            Issue History Archive
          </h1>
          <p className="text-textSecondary mt-2 font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5">Complete ledger of all library transactions.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input
              type="text"
              placeholder="Search title, name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:border-accentCyan/50 focus:ring-2 focus:ring-accentCyan/50 transition-colors shadow-inner"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-11 pr-10 py-3 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary appearance-none focus:outline-none focus:border-accentCyan/50 focus:ring-2 focus:ring-accentCyan/50 transition-colors shadow-inner custom-select"
            >
              <option value="all" className="bg-bgPrimary text-textPrimary">All Status</option>
              <option value="issued" className="bg-bgPrimary text-textPrimary">Issued</option>
              <option value="returned" className="bg-bgPrimary text-textPrimary">Returned</option>
              <option value="overdue" className="bg-bgPrimary text-textPrimary">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] overflow-hidden flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-bgPrimary/50 text-textSecondary text-sm font-bold tracking-wider">
                <th className="px-6 py-5">ID</th>
                <th className="px-6 py-5">Book Title</th>
                <th className="px-6 py-5">Student Name</th>
                <th className="px-6 py-5">Issue Date</th>
                <th className="px-6 py-5">Due Date</th>
                <th className="px-6 py-5">Return Date</th>
                <th className="px-6 py-5">Fine</th>
                <th className="px-6 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-400">
                    <History size={48} className="mx-auto mb-4 text-dark-600" />
                    <p>No transactions found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={item.issue_id} 
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-5 text-textSecondary font-mono">#{item.issue_id}</td>
                    <td className="px-6 py-5 font-bold text-textPrimary group-hover:text-accentCyan transition-colors">
                      {item.book_title}
                    </td>
                    <td className="px-6 py-5 text-textPrimary">{item.student_name}</td>
                    <td className="px-6 py-5 text-textSecondary text-sm">
                      {new Date(item.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-textSecondary text-sm">
                      {new Date(item.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-textSecondary text-sm">
                      {item.return_date ? new Date(item.return_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-5 font-bold">
                      {item.fine_amount > 0 ? (
                        <span className="text-red-400 flex items-center">
                          <IndianRupee size={14} />{item.fine_amount}
                        </span>
                      ) : (
                        <span className="text-textSecondary">-</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(item.dynamic_status)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 bg-bgPrimary/50 backdrop-blur-md text-sm text-textSecondary flex justify-between items-center font-bold">
          <span>Showing {filteredHistory.length} transaction(s)</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default IssueHistory;
