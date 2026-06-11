import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Book, Loader2, Library, BookOpenCheck, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        const response = await api.get('/student/my-books');
        setBooks(response.data);
      } catch (err) {
        setError('Failed to load your books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
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
      case 'issued':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <BookOpenCheck size={14} /> Issued
          </span>
        );
      case 'returned':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <CheckCircle2 size={14} /> Returned
          </span>
        );
      case 'overdue':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
            <AlertCircle size={14} /> Overdue
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-6 rounded-3xl overflow-hidden shadow-sm border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
      {/* Global background handles library theme */}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <h1 className="text-4xl font-black text-slate-100 mb-2 flex items-center gap-3 tracking-tight">
              <Library className="text-teal-400" size={36} />
              My Borrowed Books
            </h1>
            <p className="text-slate-300 text-lg font-medium bg-slate-800/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-slate-700/50 mt-2">
              Track your current reads and past reading history.
            </p>
          </div>
        </motion.div>

        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center">
              <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
              <p className="text-gray-400 font-medium">Fetching your library history...</p>
            </div>
          ) : error ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 p-6 rounded-2xl text-center shadow-lg shadow-red-500/5">
              {error}
            </motion.div>
          ) : books.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="absolute inset-0 flex flex-col justify-center items-center text-center py-16 bg-slate-800/30 backdrop-blur-md rounded-3xl border border-slate-700/50"
            >
              <div className="w-24 h-24 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Book className="text-slate-400" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-slate-200 mb-2">No borrowed books found</h3>
              <p className="text-slate-400 text-lg max-w-md">You haven't borrowed any books yet. Check out the catalog to find your next great read!</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12"
            >
              <AnimatePresence>
                {books.map((book, index) => (
                  <motion.div 
                    key={book.issue_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="bg-slate-800/40 backdrop-blur-2xl border border-slate-700/50 rounded-3xl overflow-hidden hover:border-teal-500/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-3 transition-all duration-300 group flex flex-col h-full shadow-lg"
                  >
                    <div className="h-64 bg-gradient-to-br from-slate-900/80 to-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:from-slate-800/90 group-hover:to-slate-700/90 transition-colors border-b border-slate-700/30">
                      {/* Real Book Cover Graphic */}
                      <div className="w-40 h-56 rounded-r-xl border-l-[6px] border-slate-900 shadow-[15px_15px_30px_rgba(0,0,0,0.6)] flex flex-col justify-between transform group-hover:rotate-2 group-hover:scale-110 transition-all duration-500 relative overflow-hidden bg-slate-900">
                        <img 
                          src={getCoverImage(book.category)} 
                          alt={`${book.title} Cover`}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h4 className="text-white text-xs font-bold line-clamp-2 leading-tight drop-shadow-md">{book.title}</h4>
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 z-10">
                        {getStatusBadge(book.status)}
                      </div>
                      
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/50 backdrop-blur-md border border-slate-700/50 text-slate-100 shadow-sm capitalize">
                        {book.category}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 bg-slate-900/20">
                      <h3 className="text-xl font-bold text-slate-100 mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-400 mb-4">{book.author}</p>
                      
                      <div className="space-y-2 mb-4 mt-auto">
                        <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                          <span className="text-slate-500 flex items-center gap-1"><Clock size={14}/> Issue Date</span>
                          <span className="text-slate-300 font-medium">{new Date(book.issue_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                          <span className="text-slate-500 flex items-center gap-1"><Clock size={14}/> Due Date</span>
                          <span className="text-slate-300 font-medium">{new Date(book.due_date).toLocaleDateString()}</span>
                        </div>
                        {book.return_date && (
                          <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
                            <span className="text-slate-500 flex items-center gap-1"><CheckCircle2 size={14}/> Return Date</span>
                            <span className="text-teal-400 font-medium">{new Date(book.return_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center text-sm pt-1">
                          <span className="text-slate-500 font-medium">Fine Amount</span>
                          <span className={`font-bold ${book.fine_amount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                            ₹{Number(book.fine_amount).toFixed(2)}
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

export default MyBooks;
