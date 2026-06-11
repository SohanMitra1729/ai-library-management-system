import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Book, Search, Loader2, Library, BookOpenCheck, BookX, X, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BooksCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservationStatus, setReservationStatus] = useState({ loading: false, error: '', success: '' });

  const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Database', 'Operating Systems', 'Networking', 'Cyber Security', 'Software Engineering', 'Algorithms'];

  const handleReserve = async (bookId) => {
    setReservationStatus({ loading: true, error: '', success: '' });
    try {
      await api.post('/reservations/reserve', { book_id: bookId });
      setReservationStatus({ loading: false, error: '', success: 'Book reserved successfully!' });
      
      // Update local state to reflect reduced available copies
      setBooks(prevBooks => {
          const updatedBooks = Array.isArray(prevBooks) ? prevBooks : (prevBooks.books || []);
          return updatedBooks.map(b => 
            b.id === bookId ? { ...b, available_copies: b.available_copies - 1 } : b
          );
      });
      setSelectedBook(prev => ({ ...prev, available_copies: prev.available_copies - 1 }));
      
      setTimeout(() => setReservationStatus({ loading: false, error: '', success: '' }), 3000);
    } catch (err) {
      setReservationStatus({ loading: false, error: err.response?.data?.message || 'Failed to reserve book', success: '' });
      setTimeout(() => setReservationStatus({ loading: false, error: '', success: '' }), 4000);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        
        console.log('Books API Response:', response.data);

        if (Array.isArray(response.data)) {
            setBooks(response.data);
        } else if (response.data.books && Array.isArray(response.data.books)) {
            setBooks(response.data.books);
        } else {
            console.error('Invalid books response:', response.data);
            setBooks([]);
        }
      } catch (err) {
        console.error('Books fetch failed:', err);
        setError('Unable to load books. Please try again.');
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const safeBooks = Array.isArray(books) 
    ? books 
    : books?.books || [];

  const filteredBooks = safeBooks.filter(book => {
    // Category filter
    const matchCategory = selectedCategory === 'All' || book.category === selectedCategory;

    // Smart search filter (title, author, category, description)
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (book.title || '').toLowerCase().includes(term) ||
      (book.author || '').toLowerCase().includes(term) ||
      (book.category || '').toLowerCase().includes(term) ||
      (book.description || '').toLowerCase().includes(term);

    return matchCategory && matchSearch;
  });

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

  return (
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Local faint library background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      {/* Main Content (Needs relative z-10) */}
      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
        <div>
          <h1 className="text-4xl font-black text-textPrimary mb-2 flex items-center gap-3 tracking-tight">
            <Library className="text-accentCyan" size={36} />
            Explore Catalog
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5 mt-2">Discover your next great read from our extensive collection.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-accentCyan transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search titles, authors, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:bg-white/10"
          />
        </div>
      </motion.div>

      {/* Category Chips */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-3 no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border backdrop-blur-md ${
              selectedCategory === cat 
                ? 'bg-accentCyan/20 text-accentCyan border-accentCyan/50 shadow-[0_4px_20px_rgba(0,212,200,0.3)] scale-105' 
                : 'bg-white/5 text-textSecondary border-white/10 hover:bg-white/10 hover:text-white shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
            <p className="text-gray-400 font-medium">Curating your library...</p>
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl text-center shadow-sm">
            {error}
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="absolute inset-0 flex flex-col justify-center items-center text-center py-16 bg-dark-800/30 backdrop-blur-md rounded-3xl border border-dark-700/50"
          >
            <div className="w-24 h-24 bg-slate-800/50 border border-slate-700/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Book className="text-slate-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">No books available.</h3>
            <p className="text-slate-400 text-lg max-w-md">We couldn't find any books matching "{searchTerm}". Try adjusting your search.</p>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12"
          >
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <motion.div 
                  key={book.id}
                  layoutId={`book-card-${book.id}`}
                  onClick={() => setSelectedBook(book)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[24px] overflow-hidden hover:border-accentCyan/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full shadow-[0_8px_24px_rgba(0,0,0,0.3)] cursor-pointer"
                >
                  <div className="h-64 bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden group-hover:from-white/10 transition-colors border-b border-white/5">
                    {/* Real Book Cover Graphic */}
                    <div className="w-40 h-56 rounded-r-xl border-l-[6px] border-bgPrimary shadow-[15px_15px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between transform group-hover:rotate-3 group-hover:scale-[1.08] transition-all duration-500 relative overflow-hidden bg-bgSecondary">
                      <img 
                        src={getCoverImage(book.category)} 
                        alt={`${book.title} Cover`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h4 className="text-white text-[10px] font-bold line-clamp-2 leading-tight drop-shadow-md">{book.title}</h4>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                      {book.available_copies > 0 ? (
                        <span className="px-3 py-1 bg-accentCyan/20 text-accentCyan border border-accentCyan/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                          <BookOpenCheck size={14} /> Available
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                          <BookX size={14} /> Issued Out
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-black/40 backdrop-blur-md border border-white/10 text-slate-200 shadow-lg capitalize">
                      {book.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-transparent to-black/20">
                    <h3 className="text-xl font-bold text-textPrimary mb-1 line-clamp-1 group-hover:text-accentCyan transition-colors" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-sm font-medium text-accentCyan mb-4">{book.author}</p>
                    
                    <p className="text-sm text-textSecondary mb-6 line-clamp-3 leading-relaxed flex-1" title={book.description}>
                      {book.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-textSecondary uppercase tracking-wider font-bold mb-1">Copies</span>
                        <span className="text-sm font-bold text-slate-300">
                          <span className={book.available_copies > 0 ? 'text-accentCyan' : 'text-red-400'}>{book.available_copies}</span> / {book.total_copies}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-textSecondary uppercase tracking-wider font-bold mb-1">ISBN</span>
                        <span className="text-xs text-textSecondary font-mono bg-black/40 px-2 py-1 rounded-md border border-white/5">{book.isbn}</span>
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
      
      {/* Book Details Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              layoutId={`book-card-${selectedBook.id}`}
              className="relative w-full max-w-4xl max-h-[90vh] bg-bgPrimary border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden flex flex-col md:flex-row z-10"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-red-500 border border-white/10 text-white rounded-full transition-all backdrop-blur-md shadow-lg"
              >
                <X size={24} />
              </button>

              <div className="md:w-2/5 h-64 md:h-auto bg-slate-800 relative shrink-0">
                <img 
                  src={getCoverImage(selectedBook.category)} 
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-900"></div>
              </div>

              <div className="p-8 md:p-12 flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-accentCyan/10 text-accentCyan border border-accentCyan/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                    {selectedBook.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-textPrimary mb-2 leading-tight">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xl text-textSecondary font-medium">by {selectedBook.author}</p>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex-1 min-w-[120px] bg-cardBgGlass backdrop-blur-[18px] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-textSecondary font-bold uppercase mb-1">Status</p>
                    <p className="font-bold text-lg">
                      {selectedBook.available_copies > 0 ? (
                        <span className="text-accentCyan flex items-center gap-2"><BookOpenCheck size={18}/> Available</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-2"><BookX size={18}/> Issued Out</span>
                      )}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[120px] bg-cardBgGlass backdrop-blur-[18px] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-textSecondary font-bold uppercase mb-1">Copies</p>
                    <p className="font-bold text-lg text-textPrimary">
                      {selectedBook.available_copies} <span className="text-textSecondary text-sm">/ {selectedBook.total_copies}</span>
                    </p>
                  </div>
                  <div className="flex-1 min-w-[120px] bg-cardBgGlass backdrop-blur-[18px] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-textSecondary font-bold uppercase mb-1">ISBN</p>
                    <p className="font-mono text-textPrimary">{selectedBook.isbn}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100 mb-3">About this book</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">
                    {selectedBook.description || "No detailed description is available for this book at the moment. Please contact the librarian for more information."}
                  </p>
                  
                  {reservationStatus.error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-4 text-sm font-medium">
                      {reservationStatus.error}
                    </div>
                  )}
                  {reservationStatus.success && (
                    <div className="bg-accentCyan/10 border border-accentCyan/50 text-accentCyan p-3 rounded-xl mb-4 text-sm font-bold">
                      {reservationStatus.success}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleReserve(selectedBook.id)}
                    disabled={selectedBook.available_copies <= 0 || reservationStatus.loading}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-bgPrimary bg-accentCyan hover:bg-white hover:text-accentCyan hover:shadow-[0_0_15px_rgba(0,212,200,0.5)] transition-all disabled:opacity-50 disabled:hover:bg-accentCyan disabled:hover:text-bgPrimary disabled:hover:shadow-none"
                  >
                    {reservationStatus.loading ? <Loader2 className="animate-spin" size={20} /> : <BookmarkPlus size={20} />}
                    Reserve Book
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooksCatalog;
