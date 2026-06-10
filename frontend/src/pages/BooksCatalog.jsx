import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Book, Search, Loader2, Library, BookOpenCheck, BookX, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BooksCatalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Database', 'Operating Systems', 'Networking', 'Cyber Security', 'Software Engineering', 'Algorithms'];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (err) {
        setError('Failed to load books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book => {
    // Category filter
    const matchCategory = selectedCategory === 'All' || book.category === selectedCategory;

    // Smart search filter (title, author, category, description)
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term) ||
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
    <div className="relative max-w-7xl mx-auto min-h-[80vh] flex flex-col p-6 rounded-3xl overflow-hidden shadow-2xl border border-dark-700/30">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40 pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050810]/80 via-[#050810]/50 to-[#050810]/90 pointer-events-none"></div>

      {/* Main Content (Needs relative z-10) */}
      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
        >
        <div>
          <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3 drop-shadow-lg">
            <Library className="text-primary-400 drop-shadow-md" size={36} />
            Explore Catalog
          </h1>
          <p className="text-gray-200 text-lg font-medium drop-shadow-md bg-black/20 p-1.5 px-3 rounded-lg inline-block backdrop-blur-sm border border-white/5 mt-2">Discover your next great read from our extensive collection.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary-500 transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search titles, authors, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-dark-800/80 backdrop-blur-md border border-dark-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all shadow-lg"
          />
        </div>
      </motion.div>

      {/* Category Chips */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-3 no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 shadow-lg border ${
              selectedCategory === cat 
                ? 'bg-primary-500 text-white border-primary-400 shadow-primary-500/20 scale-105' 
                : 'bg-dark-800/50 text-gray-400 border-dark-600 hover:bg-dark-700/50 hover:text-white'
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-500 p-6 rounded-2xl text-center shadow-lg shadow-red-500/5">
            {error}
          </motion.div>
        ) : filteredBooks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="absolute inset-0 flex flex-col justify-center items-center text-center py-16 bg-dark-800/30 backdrop-blur-md rounded-3xl border border-dark-700/50"
          >
            <div className="w-24 h-24 bg-dark-700/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Book className="text-gray-500" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-2">No books found</h3>
            <p className="text-gray-500 text-lg max-w-md">We couldn't find any books matching "{searchTerm}". Try adjusting your search.</p>
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
                  className="bg-[#0a0f1c]/70 backdrop-blur-2xl border border-dark-600/50 rounded-3xl overflow-hidden hover:border-primary-500/60 hover:shadow-[0_15px_40px_rgba(56,189,248,0.25)] hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full shadow-xl cursor-pointer"
                >
                  <div className="h-56 bg-gradient-to-br from-dark-900 to-dark-800 flex items-center justify-center relative overflow-hidden group-hover:from-dark-800 group-hover:to-dark-700 transition-colors">
                    {/* Real Book Cover Graphic */}
                    <div className="w-36 h-48 rounded-r-lg border-l-[6px] border-dark-900 shadow-[20px_0_30px_rgba(0,0,0,0.8)] flex flex-col justify-between transform group-hover:rotate-2 group-hover:scale-[1.03] transition-all duration-500 relative overflow-hidden bg-dark-900">
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
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                          <BookOpenCheck size={14} /> Available
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                          <BookX size={14} /> Issued Out
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/10 text-white shadow-lg capitalize">
                      {book.category}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-sm font-medium text-gray-400 mb-4">{book.author}</p>
                    
                    <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed flex-1" title={book.description}>
                      {book.description || "No description available."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-dark-700/50 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Copies</span>
                        <span className="text-sm font-bold text-gray-300">
                          <span className={book.available_copies > 0 ? 'text-teal-400' : 'text-red-400'}>{book.available_copies}</span> / {book.total_copies}
                        </span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">ISBN</span>
                        <span className="text-xs text-gray-400 font-mono bg-dark-900 px-2 py-1 rounded-md border border-dark-700">{book.isbn}</span>
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
              className="relative w-full max-w-4xl max-h-[90vh] bg-dark-900 border border-dark-700 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row z-10"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={24} />
              </button>

              <div className="md:w-2/5 h-64 md:h-auto bg-dark-800 relative shrink-0">
                <img 
                  src={getCoverImage(selectedBook.category)} 
                  alt={selectedBook.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-dark-900"></div>
              </div>

              <div className="p-8 md:p-12 flex-1 overflow-y-auto custom-scrollbar">
                <div className="mb-6">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-300 border border-primary-500/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                    {selectedBook.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
                    {selectedBook.title}
                  </h2>
                  <p className="text-xl text-gray-400 font-medium">by {selectedBook.author}</p>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="flex-1 min-w-[120px] bg-dark-800/50 border border-dark-700 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Status</p>
                    <p className="font-bold text-lg">
                      {selectedBook.available_copies > 0 ? (
                        <span className="text-teal-400 flex items-center gap-2"><BookOpenCheck size={18}/> Available</span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-2"><BookX size={18}/> Issued Out</span>
                      )}
                    </p>
                  </div>
                  <div className="flex-1 min-w-[120px] bg-dark-800/50 border border-dark-700 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Copies</p>
                    <p className="font-bold text-lg text-white">
                      {selectedBook.available_copies} <span className="text-gray-500 text-sm">/ {selectedBook.total_copies}</span>
                    </p>
                  </div>
                  <div className="flex-1 min-w-[120px] bg-dark-800/50 border border-dark-700 rounded-2xl p-4">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">ISBN</p>
                    <p className="font-mono text-gray-300">{selectedBook.isbn}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">About this book</h3>
                  <p className="text-gray-400 leading-relaxed">
                    {selectedBook.description || "No detailed description is available for this book at the moment. Please contact the librarian for more information."}
                  </p>
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
