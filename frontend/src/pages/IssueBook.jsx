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
    <div className="relative min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Local background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full mt-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-textPrimary mb-3 flex items-center justify-center gap-3">
            <BookUp className="text-accentOrange" size={36} />
            Issue Book
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5">Issue a book to a user and track due dates.</p>
        </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-accentOrange/10 border border-accentOrange/50 text-accentOrange p-4 rounded-xl mb-6 flex flex-col gap-2 backdrop-blur-md shadow-lg font-bold">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-semibold">{success}</span>
          </div>
          {issueId && (
            <div className="text-sm opacity-90 text-center mt-2">
              Issue ID: <span className="font-mono text-white bg-black/50 px-3 py-1 rounded-md border border-white/10 ml-2">{issueId}</span>
              <p className="text-[11px] text-textSecondary mt-2 uppercase tracking-wide">Please provide this Issue ID to the user for return</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-cardBgGlass border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-[18px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentOrange/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="space-y-6 mb-8 relative z-10">
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">User ID *</label>
            <input
              type="number"
              name="user_id"
              required
              min="1"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentOrange/50 focus:border-accentOrange/50 transition-all shadow-inner font-mono"
              placeholder="Enter User ID"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Book ID *</label>
            <input
              type="number"
              name="book_id"
              required
              min="1"
              value={formData.book_id}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentOrange/50 focus:border-accentOrange/50 transition-all shadow-inner font-mono"
              placeholder="Enter Book ID"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Due Date *</label>
            <input
              type="date"
              name="due_date"
              required
              value={formData.due_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-5 py-3.5 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentOrange/50 focus:border-accentOrange/50 transition-all shadow-inner [color-scheme:dark]"
            />
            <p className="text-xs text-textSecondary mt-2">Default is 14 days from today.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
          <button
            type="button"
            className="text-textSecondary hover:text-accentOrange transition-colors font-bold text-sm"
            onClick={() => setFormData(prev => ({ ...prev, due_date: defaultDateString }))}
          >
            Reset Default Date
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-bgPrimary bg-accentOrange hover:bg-white hover:text-accentOrange hover:shadow-[0_0_20px_rgba(245,158,11,0.6)] focus:ring-2 focus:ring-offset-2 focus:ring-accentOrange focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentOrange disabled:hover:text-bgPrimary disabled:hover:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookUp size={20} />}
            Issue Book
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default IssueBook;
