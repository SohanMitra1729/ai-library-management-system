import React, { useState } from 'react';
import api from '../api/axios';
import { BookPlus, Loader2, CheckCircle2 } from 'lucide-react';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    total_copies: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'total_copies' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/books', formData);
      setSuccess('Book added successfully to the catalog!');
      setFormData({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category: '',
        total_copies: 1,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Local background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-textPrimary mb-3 flex items-center justify-center gap-3">
            <BookPlus className="text-accentCyan" size={36} />
            Add New Book
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5">Expand the library catalog with new resources.</p>
        </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-accentCyan/10 border border-accentCyan/50 text-accentCyan p-4 rounded-xl mb-6 flex items-center justify-center gap-3 backdrop-blur-md shadow-lg font-bold">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-cardBgGlass border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-[18px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentCyan/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Book Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner"
              placeholder="e.g. The Great Gatsby"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Author *</label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner"
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">ISBN *</label>
            <input
              type="text"
              name="isbn"
              required
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner font-mono"
              placeholder="e.g. 978-0743273565"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Category *</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner"
              placeholder="e.g. Fiction, Science, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all resize-none shadow-inner custom-scrollbar"
              placeholder="Brief description of the book..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Total Copies *</label>
            <input
              type="number"
              name="total_copies"
              min="1"
              required
              value={formData.total_copies}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentCyan/50 focus:border-accentCyan/50 transition-all shadow-inner font-mono"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end relative z-10">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-bgPrimary bg-accentCyan hover:bg-white hover:text-accentCyan hover:shadow-[0_0_20px_rgba(0,212,200,0.6)] focus:ring-2 focus:ring-offset-2 focus:ring-accentCyan focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentCyan disabled:hover:text-bgPrimary disabled:hover:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookPlus size={20} />}
            Add Book to Catalog
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddBook;
