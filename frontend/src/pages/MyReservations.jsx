import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Bookmark, Loader2, BookmarkCheck, BookX, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const response = await api.get('/reservations/my-reservations');
        setReservations(response.data);
      } catch (err) {
        setError('Failed to load your reservations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  const getCoverImage = (category) => {
    const covers = {
      'Algorithms': 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Database': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Machine Learning': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Artificial Intelligence': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Cyber Security': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Web Development': 'https://images.unsplash.com/photo-1627398246734-d8dbf4b2326b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Cloud Computing': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'Operating Systems': 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    };
    return covers[category] || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-3 py-1 bg-accentCyan/20 text-accentCyan border border-accentCyan/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <Clock size={14} /> Active
          </span>
        );
      case 'Collected':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <BookmarkCheck size={14} /> Collected
          </span>
        );
      case 'Expired':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <BookX size={14} /> Expired
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Global background handles library theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-textPrimary mb-2 flex items-center gap-3 tracking-tight">
              <Bookmark className="text-accentCyan" size={36} />
              My Reservations
            </h1>
            <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5 mt-2">
              Track your currently reserved books and past reservations.
            </p>
          </div>
        </motion.div>

        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <Loader2 className="animate-spin text-accentCyan mb-4" size={48} />
              <p className="text-textSecondary font-bold tracking-widest uppercase text-sm">Fetching your reservations...</p>
            </div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-[24px] text-center shadow-lg font-bold">
              {error}
            </motion.div>
          ) : reservations.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 flex flex-col justify-center items-center text-center py-16 bg-cardBgGlass backdrop-blur-[18px] rounded-[32px] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="w-24 h-24 bg-bgPrimary/50 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Bookmark className="text-textSecondary" size={48} />
              </div>
              <h3 className="text-2xl font-black text-textPrimary mb-2">No reservations found</h3>
              <p className="text-textSecondary text-lg max-w-md font-medium">You haven't reserved any books yet. Check out the catalog to find your next great read!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12"
            >
              <AnimatePresence>
                {reservations.map((reservation, index) => (
                  <motion.div 
                    key={reservation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-cardBgGlass backdrop-blur-[18px] border border-white/5 rounded-[32px] overflow-hidden hover:border-accentCyan/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
                  >
                    <div className="h-64 bg-bgSecondary flex items-center justify-center relative overflow-hidden transition-colors border-b border-white/5">
                      {/* Real Book Cover Graphic */}
                      <div className="w-40 h-56 rounded-r-xl border-l-[6px] border-bgPrimary shadow-[15px_15px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between transform group-hover:rotate-2 group-hover:scale-110 transition-all duration-500 relative overflow-hidden bg-bgPrimary">
                        <img 
                          src={getCoverImage(reservation.category)} 
                          alt={`${reservation.title} Cover`}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-bgPrimary via-bgPrimary/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-textPrimary text-xs font-black line-clamp-2 leading-tight drop-shadow-md">{reservation.title}</h4>
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 z-10">
                        {getStatusBadge(reservation.status)}
                      </div>
                      
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-bgPrimary/80 backdrop-blur-md border border-white/10 text-textPrimary shadow-sm capitalize tracking-wide">
                        {reservation.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 bg-bgPrimary/30">
                      <h3 className="text-xl font-bold text-textPrimary mb-1 line-clamp-1 group-hover:text-accentCyan transition-colors" title={reservation.title}>
                        {reservation.title}
                      </h3>
                      <p className="text-sm font-bold text-textSecondary uppercase tracking-wider mb-4">{reservation.author}</p>
                      
                      <div className="space-y-3 mb-4 mt-auto">
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                          <span className="text-textSecondary flex items-center gap-1 font-bold"><Clock size={14}/> Reserved On</span>
                          <span className="text-textPrimary font-mono">{new Date(reservation.reservation_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                          <span className="text-textSecondary flex items-center gap-1 font-bold"><Clock size={14}/> Expires On</span>
                          <span className="text-accentCyan font-mono">{new Date(reservation.expiry_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2">
                          <span className="text-textSecondary font-bold">Reservation ID</span>
                          <span className="font-mono font-bold text-lg text-textPrimary">
                            #{reservation.id}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default MyReservations;
