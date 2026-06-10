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
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Add New Book</h1>
        <p className="text-gray-400">Add a new book to the library catalog.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary-500/10 border border-primary-500/50 text-primary-400 p-4 rounded-xl mb-6 flex items-center gap-3">
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Book Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. The Great Gatsby"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Author *</label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. F. Scott Fitzgerald"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">ISBN *</label>
            <input
              type="text"
              name="isbn"
              required
              value={formData.isbn}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. 978-0743273565"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category *</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="e.g. Fiction, Science, etc."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
              placeholder="Brief description of the book..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Total Copies *</label>
            <input
              type="number"
              name="total_copies"
              min="1"
              required
              value={formData.total_copies}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-dark-700 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-500 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookPlus size={20} />}
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
