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
        <div className="inline-flex items-center justify-center p-3 bg-purple-500/20 rounded-2xl mb-4 border border-purple-500/30">
          <Sparkles className="text-purple-400" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          AI Book Recommendations
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Tell our AI Librarian what you're interested in learning, reading, or exploring, and get highly personalized book suggestions instantly.
        </p>
      </div>

      <div className="bg-dark-800/80 backdrop-blur-xl border border-dark-700/50 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What topics, genres, or concepts interest you?
            </label>
            <textarea
              rows="4"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. I want to learn about quantum computing and its impact on modern cryptography, but explained simply."
              className="w-full px-5 py-4 bg-dark-900/50 border border-dark-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none text-lg leading-relaxed shadow-inner"
              required
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !interests.trim()}
              className="flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-dark-800 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
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
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="text-purple-400" />
            Recommended for You
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((book, index) => (
              <div 
                key={index} 
                className="bg-dark-800 border border-dark-700 hover:border-purple-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] group relative overflow-hidden"
              >
                {/* Number indicator */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500/40 font-black text-2xl group-hover:scale-150 transition-transform duration-500">
                  {index + 1}
                </div>

                <div className="mb-4 pr-8 relative z-10">
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-md mb-3 border border-purple-500/30">
                    {book.category}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-400">by {book.author}</p>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed relative z-10">
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
