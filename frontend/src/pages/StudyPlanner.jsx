import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { BrainCircuit, Loader2, Calendar } from 'lucide-react';

const StudyPlanner = () => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState(15);
  const [studyPlan, setStudyPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim() || duration < 1) return;

    setLoading(true);
    setError('');
    setStudyPlan('');

    try {
      const response = await api.post('/study-planner/generate', { goal, duration });
      setStudyPlan(response.data.studyPlan);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate study plan. Ensure the API key is configured.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative max-w-5xl mx-auto min-h-[85vh] flex flex-col p-8 rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/5 bg-bgPrimary">
      {/* Global background - Educational Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-[0.4] blur-[3px]"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")' }}
        ></div>
        {/* Light blue / Navy blue overlay for elegant contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-bgPrimary/70 to-bgPrimary/95 mix-blend-multiply"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/20 rounded-2xl mb-4 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <BrainCircuit className="text-blue-400" size={32} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight drop-shadow-md">
            AI Study Planner
          </h1>
          <p className="text-blue-100 text-lg font-medium bg-blue-900/40 p-2 px-6 rounded-xl inline-block backdrop-blur-md border border-blue-500/10 mx-auto max-w-2xl shadow-sm">
            Generate personalized learning roadmaps powered by AI.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-cardBgGlass backdrop-blur-[18px] border border-white/10 rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.6)] mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="md:col-span-3">
                <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-3">
                  Learning Goal
                </label>
                <textarea
                  rows="2"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Learn DBMS for placements"
                  className="w-full px-5 py-4 bg-bgPrimary/50 border border-white/10 rounded-[24px] text-textPrimary placeholder-textSecondary/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none text-lg shadow-inner custom-scrollbar"
                  required
                ></textarea>
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-textSecondary uppercase tracking-wider mb-3">
                  Duration (Days)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value) || '')}
                    className="w-full px-5 py-4 pl-12 bg-bgPrimary/50 border border-white/10 rounded-[24px] text-textPrimary focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg shadow-inner"
                    required
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading || !goal.trim() || !duration}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-bgPrimary transition-all duration-300 disabled:opacity-50 disabled:hover:bg-blue-600 w-full justify-center md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <BrainCircuit size={22} />
                    Generate Plan
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 backdrop-blur-md shadow-lg font-medium text-center">
            {error}
          </motion.div>
        )}

        {studyPlan && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-cardBgGlass backdrop-blur-[18px] border border-blue-500/30 rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)] prose prose-invert prose-blue max-w-none prose-headings:text-blue-100 prose-a:text-blue-400 prose-strong:text-blue-200 prose-ul:bg-blue-900/20 prose-ul:rounded-xl prose-ul:p-6 prose-ul:border prose-ul:border-blue-500/10"
          >
            <ReactMarkdown>{studyPlan}</ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanner;
