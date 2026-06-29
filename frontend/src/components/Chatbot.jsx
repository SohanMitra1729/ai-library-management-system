import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    'Recommend Books',
    'Make Study Plan',
    'My Borrowed Books',
    'My Reservations',
    'My Fines',
    'Help'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat/message', {
        message: text,
        history: messages
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.response }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[550px] max-h-[80vh] flex flex-col bg-bgSecondary/90 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-bgPrimary/80 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-accentCyan/20 p-2 rounded-full">
                  <Bot size={20} className="text-accentCyan" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">NexusLib Assistant</h3>
                  <p className="text-xs text-accentCyan">AI is online</p>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-textSecondary hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-white/5 p-4 rounded-full mb-4">
                    <MessageSquare size={32} className="text-accentBlue/60" />
                  </div>
                  <h4 className="text-white font-semibold mb-2">How can I help you today?</h4>
                  <p className="text-sm text-textSecondary mb-6">Ask me about library books, your account, or get study recommendations!</p>
                  
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestionChips.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(chip)}
                        className="text-xs px-3 py-1.5 bg-cardBgGlass hover:bg-white/10 border border-white/10 rounded-full text-textSecondary transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-sm'
                          : 'bg-cardBgGlass border border-white/5 text-textPrimary rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <p className="text-sm">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-snug prose-headings:text-sm prose-a:text-accentCyan">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="self-start bg-cardBgGlass border border-white/5 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={16} className="text-accentCyan animate-spin" />
                  <span className="text-xs text-textSecondary">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-bgPrimary/80 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-textSecondary/50 focus:outline-none focus:border-accentCyan/50"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-accentCyan text-bgPrimary p-2 rounded-full hover:bg-accentCyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-gradient-to-br from-accentCyan to-accentBlue rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,212,200,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(0,212,200,0.6)] transition-all duration-300 z-50 text-bgPrimary relative"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-accentCyan"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
