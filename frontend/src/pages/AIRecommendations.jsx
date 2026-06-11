import React, { useState } from 'react';
import api from '../api/axios';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

const AIRecommendations = () => {
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!interests.trim()) return;

    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await api.post('/ai/recommend', { interests });
      setRecommendations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get recommendations. Ensure the API key is configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto min-h-[80vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Global background handles library theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.5] blur-[2px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-bgPrimary/20 via-bgPrimary/40 to-bgPrimary/90"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-accentPurple/20 rounded-2xl mb-4 border border-accentPurple/30 shadow-[0_0_15px_rgba(155,92,246,0.3)]">
            <Sparkles className="text-accentPurple" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-textPrimary mb-3 tracking-tight">
            AI Book Recommendations
          </h1>
          <p className="text-textSecondary text-lg font-medium bg-bgSecondary/40 p-2 px-4 rounded-xl inline-block backdrop-blur-md border border-white/5 mx-auto max-w-2xl">
            Tell our AI Librarian what you're interested in learning, reading, or exploring, and get highly personalized book suggestions instantly.
          </p>
        </div>

        <div className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[32px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] mb-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accentPurple/10 rounded-full blur-[100px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-8">
            <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-3">
              What topics, genres, or concepts interest you?
            </label>
            <textarea
              rows="4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. I want to learn about quantum computing and its impact on modern cryptography, but explained simply."
              className="w-full px-5 py-4 bg-bgPrimary/50 border border-white/10 rounded-[24px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-accentPurple/50 focus:border-accentPurple/50 transition-all resize-none text-lg leading-relaxed shadow-inner custom-scrollbar"
              required
            ></textarea>
          </div>

          <div className="pt-6 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={loading || !interests.trim()}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-bgPrimary bg-accentPurple hover:bg-white hover:text-accentPurple hover:shadow-[0_0_20px_rgba(155,92,246,0.6)] focus:ring-2 focus:ring-offset-2 focus:ring-accentPurple focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-accentPurple disabled:hover:text-bgPrimary disabled:hover:shadow-none w-full justify-center md:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Consulting AI...
                </>
              ) : (
                <>
                  <Sparkles size={22} />
                  Get Recommendations
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
            <BookOpen className="text-accentPurple" />
            Recommended for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((book, index) => (
              <div 
                key={index} 
                className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 hover:border-accentPurple/50 rounded-[24px] p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(155,92,246,0.2)] hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Number indicator */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accentPurple/10 rounded-full flex items-center justify-center text-accentPurple/40 font-black text-2xl group-hover:scale-150 transition-transform duration-500">
                  {index + 1}
                </div>

                <div className="mb-4 pr-8 relative z-10">
                  <span className="inline-block px-3 py-1 bg-accentPurple/20 text-accentPurple text-xs font-semibold rounded-md mb-3 border border-accentPurple/30">
                    {book.category}
                  </span>
                  <h3 className="text-xl font-bold text-textPrimary mb-1 group-hover:text-accentPurple transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-textSecondary">by {book.author}</p>
                </div>
                
                <p className="text-textSecondary text-sm leading-relaxed relative z-10">
                  {book.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AIRecommendations;
