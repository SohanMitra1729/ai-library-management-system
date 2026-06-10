import React, { useState } from 'react';
import api from '../api/axios';
import { BookUp, Loader2, CheckCircle2 } from 'lucide-react';

const IssueBook = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    book_id: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [issueId, setIssueId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setIssueId(null);

    try {
      const response = await api.post('/issue/issue', {
        user_id: parseInt(formData.user_id),
        book_id: parseInt(formData.book_id),
        due_date: formData.due_date,
      });
      setSuccess('Book issued successfully!');
      setIssueId(response.data.issue_id);
      setFormData({
        user_id: '',
        book_id: '',
        due_date: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate default due date (14 days from now)
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14);
  const defaultDateString = defaultDueDate.toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Issue Book</h1>
        <p className="text-gray-400">Issue a book to a user.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-primary-500/10 border border-primary-500/50 text-primary-400 p-4 rounded-xl mb-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-semibold">{success}</span>
          </div>
          {issueId && (
            <div className="text-sm opacity-90 pl-8">
              Issue ID: <span className="font-mono text-white bg-dark-900 px-2 py-0.5 rounded">{issueId}</span>
              <br/>
              (Please provide this Issue ID to the user for return)
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
        <div className="space-y-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">User ID *</label>
            <input
              type="number"
              name="user_id"
              required
              min="1"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Book ID *</label>
            <input
              type="number"
              name="book_id"
              required
              min="1"
              value={formData.book_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              placeholder="Enter Book ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Due Date *</label>
            <input
              type="date"
              name="due_date"
              required
              value={formData.due_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all [color-scheme:dark]"
            />
            <p className="text-xs text-gray-500 mt-1">Default is 14 days from today.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-dark-700 flex justify-end">
          <button
            type="button"
            className="mr-4 text-gray-400 hover:text-white transition-colors"
            onClick={() => setFormData(prev => ({ ...prev, due_date: defaultDateString }))}
          >
            Set Default Date
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-orange-600 hover:bg-orange-500 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-dark-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookUp size={20} />}
            Issue Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default IssueBook;
