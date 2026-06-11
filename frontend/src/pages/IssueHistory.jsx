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
        return <span className="px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs font-bold tracking-wide uppercase">Returned</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold tracking-wide uppercase">Overdue</span>;
      default:
        return <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold tracking-wide uppercase">Issued</span>;
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
    <div className="relative max-w-7xl mx-auto h-full flex flex-col p-6 rounded-3xl overflow-hidden shadow-sm border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
      {/* Global background handles library theme */}

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 flex items-center gap-3 tracking-tight">
            <History className="text-teal-400" size={32} />
            Issue History Archive
          </h1>
          <p className="text-slate-300 mt-2 font-medium bg-slate-800/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-slate-700/50">Complete ledger of all library transactions.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search title, name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-slate-100 appearance-none focus:outline-none focus:border-teal-500 transition-colors shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-900/50 text-slate-400 text-sm font-bold tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Book Title</th>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Issue Date</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Return Date</th>
                <th className="px-6 py-4">Fine</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
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
                    className="hover:bg-slate-700/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono">#{item.issue_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-200 group-hover:text-teal-400 transition-colors">
                      {item.book_title}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{item.student_name}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(item.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(item.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {item.return_date ? new Date(item.return_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.fine_amount > 0 ? (
                        <span className="text-red-400 flex items-center">
                          <IndianRupee size={14} />{item.fine_amount}
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.dynamic_status)}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30 backdrop-blur-sm text-sm text-slate-400 flex justify-between items-center">
          <span>Showing {filteredHistory.length} transaction(s)</span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default IssueHistory;
