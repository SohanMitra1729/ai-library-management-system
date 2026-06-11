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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/20 rounded-2xl mb-4 border border-teal-500/30">
          <Sparkles className="text-teal-400" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 mb-3 tracking-tight">
          AI Book Recommendations
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Tell our AI Librarian what you're interested in learning, reading, or exploring, and get highly personalized book suggestions instantly.
        </p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-md mb-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What topics, genres, or concepts interest you?
            </label>
            <textarea
              rows="4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. I want to learn about quantum computing and its impact on modern cryptography, but explained simply."
              className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all resize-none text-lg leading-relaxed shadow-sm"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !interests.trim()}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-500 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-slate-900 transition-all shadow-md hover:shadow-[0_4px_14px_rgba(20,184,166,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
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
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-4 rounded-2xl mb-8">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
            <BookOpen className="text-teal-400" />
            Recommended for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((book, index) => (
              <div 
                key={index} 
                className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 hover:border-teal-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(20,184,166,0.15)] hover:-translate-y-1 group relative overflow-hidden"
              >
                {/* Number indicator */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center text-teal-500/40 font-black text-2xl group-hover:scale-150 transition-transform duration-500">
                  {index + 1}
                </div>

                <div className="mb-4 pr-8 relative z-10">
                  <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-md mb-3 border border-teal-500/30">
                    {book.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-teal-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-400">by {book.author}</p>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed relative z-10">
                  {book.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
