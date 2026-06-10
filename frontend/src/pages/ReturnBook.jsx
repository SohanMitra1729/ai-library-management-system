import React, { useState } from 'react';
import api from '../api/axios';
import { BookDown, Loader2, CheckCircle2 } from 'lucide-react';

const ReturnBook = () => {
  const [issueId, setIssueId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fine, setFine] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setFine(null);

    try {
      const response = await api.post('/issue/return', {
        issue_id: parseInt(issueId)
      });
      setSuccess('Book returned successfully!');
      setFine(response.data.fine_incurred);
      setIssueId('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Return Book</h1>
        <p className="text-gray-400">Process a book return using the Issue ID.</p>
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
          {fine > 0 ? (
            <div className="text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg mt-2">
              <span className="font-bold">Late Return!</span> A fine of ₹{fine} has been incurred.
            </div>
          ) : (
            <div className="text-sm opacity-90 pl-8 text-teal-300">
              Returned on time. No fine incurred.
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-1">Issue ID *</label>
          <input
            type="number"
            required
            min="1"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-lg font-mono tracking-widest"
            placeholder="e.g. 1024"
          />
          <p className="text-xs text-gray-500 mt-2">Enter the ID provided when the book was issued.</p>
        </div>

        <div className="pt-4 border-t border-dark-700 flex justify-end">
          <button
            type="submit"
            disabled={loading || !issueId}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-dark-800 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookDown size={20} />}
            Process Return
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReturnBook;
