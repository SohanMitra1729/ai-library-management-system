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
    <div className="relative min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Local background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1563901614742-df21699f8d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto w-full mt-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-textPrimary mb-3 flex items-center justify-center gap-3">
            <BookDown className="text-accentBlue" size={36} />
            Return Book
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5">Process a book return using the Issue ID.</p>
        </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-accentBlue/10 border border-accentBlue/50 text-accentBlue p-4 rounded-xl mb-6 flex flex-col gap-2 backdrop-blur-md shadow-lg font-bold">
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 size={20} />
            <span className="font-semibold">{success}</span>
          </div>
          {fine > 0 ? (
            <div className="text-red-400 bg-red-500/20 border border-red-500/30 p-3 rounded-xl mt-2 text-center shadow-inner">
              <span className="font-black uppercase tracking-wider">Late Return!</span> A fine of ₹{fine} has been incurred.
            </div>
          ) : (
            <div className="text-sm opacity-90 text-center mt-2 text-accentCyan">
              Returned on time. No fine incurred.
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-cardBgGlass border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-[18px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accentBlue/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="mb-8 relative z-10">
          <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-2">Issue ID *</label>
          <input
            type="number"
            required
            min="1"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            className="w-full px-5 py-4 bg-bgPrimary/50 border border-white/10 rounded-[16px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentBlue/50 focus:border-accentBlue/50 transition-all text-2xl font-mono tracking-widest text-center shadow-inner"
            placeholder="e.g. 1024"
          />
          <p className="text-xs text-textSecondary mt-3 text-center">Enter the ID provided when the book was issued.</p>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end relative z-10">
          <button
            type="submit"
            disabled={loading || !issueId}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-bgPrimary bg-accentBlue hover:bg-white hover:text-accentBlue hover:shadow-[0_0_20px_rgba(30,144,255,0.6)] focus:ring-2 focus:ring-offset-2 focus:ring-accentBlue focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentBlue disabled:hover:text-bgPrimary disabled:hover:shadow-none w-full justify-center md:w-auto"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <BookDown size={20} />}
            Process Return
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default ReturnBook;
