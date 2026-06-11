import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { DollarSign, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Fines = () => {
  const { isLibrarian } = useAuth();
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const endpoint = isLibrarian ? '/fines' : '/fines/my-fines';
      const response = await api.get(endpoint);
      setFines(response.data);
    } catch (err) {
      setError('Failed to load fines.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLibrarian]);

  const handlePayFine = async (id) => {
    if (!isLibrarian) return;
    try {
      setProcessingId(id);
      await api.put(`/fines/${id}/pay`);
      // Refresh list
      await fetchFines();
    } catch (err) {
      console.error('Failed to mark fine as paid:', err);
      alert('Failed to mark fine as paid. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return (
        <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg w-fit">
          <CheckCircle2 size={14} /> Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg w-fit">
        <AlertCircle size={14} /> Unpaid
      </span>
    );
  };

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Global background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-textPrimary mb-2 flex items-center gap-3 tracking-tight">
              <DollarSign className="text-accentOrange" size={36} />
              {isLibrarian ? 'Fine Management' : 'My Fines'}
            </h1>
            <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5 mt-2">
              {isLibrarian ? 'Track and collect outstanding fines.' : 'View your library fines and payment history.'}
            </p>
          </div>
        </motion.div>

        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <Loader2 className="animate-spin text-accentOrange mb-4" size={48} />
              <p className="text-textSecondary font-bold tracking-widest uppercase text-sm">Fetching fines...</p>
            </div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-[24px] text-center shadow-lg font-bold">
              {error}
            </motion.div>
          ) : fines.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 flex flex-col justify-center items-center text-center py-16 bg-cardBgGlass backdrop-blur-[18px] rounded-[32px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="w-24 h-24 bg-bgPrimary/50 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <CheckCircle2 className="text-green-400" size={48} />
              </div>
              <h3 className="text-2xl font-black text-textPrimary mb-2">No Fines Found</h3>
              <p className="text-textSecondary text-lg max-w-md font-medium">There are no fine records to display at this time.</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12"
            >
              <AnimatePresence>
                {fines.map((fine, index) => (
                  <motion.div 
                    key={fine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-cardBgGlass backdrop-blur-[18px] border border-white/5 rounded-[32px] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col relative overflow-hidden group"
                  >
                    {/* Subtle glow */}
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none opacity-20 ${fine.status === 'paid' ? 'bg-green-500' : 'bg-red-500'}`}></div>

                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <h3 className="text-3xl font-black text-textPrimary">₹{fine.amount}</h3>
                        <p className="text-textSecondary text-sm font-bold uppercase mt-1">Fine Amount</p>
                      </div>
                      {getStatusBadge(fine.status)}
                    </div>

                    <div className="space-y-3 mb-6 relative z-10">
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-textSecondary uppercase font-bold mb-1">Book Details</p>
                        <p className="text-textPrimary font-medium line-clamp-1">{fine.book_title}</p>
                      </div>
                      
                      {isLibrarian && (
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                          <p className="text-xs text-textSecondary uppercase font-bold mb-1">Student Info</p>
                          <p className="text-textPrimary font-medium">{fine.student_name}</p>
                          <p className="text-textSecondary text-sm">{fine.student_email}</p>
                        </div>
                      )}

                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-textSecondary font-bold">Issue Date:</span>
                          <span className="text-textPrimary">{new Date(fine.issue_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-textSecondary font-bold">Due Date:</span>
                          <span className="text-accentCyan">{new Date(fine.due_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-textSecondary font-bold">Return Date:</span>
                          <span className="text-textPrimary">{fine.return_date ? new Date(fine.return_date).toLocaleDateString() : 'Not Returned'}</span>
                        </div>
                        {fine.payment_date && (
                          <div className="flex justify-between pt-2 border-t border-white/10 mt-1">
                            <span className="text-textSecondary font-bold">Paid On:</span>
                            <span className="text-green-400">{new Date(fine.payment_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isLibrarian && fine.status === 'unpaid' && (
                      <button
                        onClick={() => handlePayFine(fine.id)}
                        disabled={processingId === fine.id}
                        className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white bg-accentOrange hover:bg-white hover:text-accentOrange hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50 relative z-10"
                      >
                        {processingId === fine.id ? <Loader2 className="animate-spin" size={18} /> : <DollarSign size={18} />}
                        Mark as Paid
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fines;
