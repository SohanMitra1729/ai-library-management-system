import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Library, Sparkles, Search, BarChart3, Bot, ChevronRight, BookOpen, BrainCircuit, Database, Network } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BentoCard = ({ icon: Icon, title, description, colSpan, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    className={`bg-[#0f172a]/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:bg-[#1e293b]/60 transition-all duration-500 group relative overflow-hidden ${colSpan}`}
  >
    {/* Subtle inner top highlight */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    
    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary-500/10 group-hover:border-primary-500/20">
      <Icon className="text-slate-300 group-hover:text-primary-400 transition-colors duration-300" size={24} />
    </div>
    
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-slate-100 mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-medium text-[15px]">{description}</p>
    </div>
    
    {/* Abstract background gradient for card */}
    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors duration-700"></div>
  </motion.div>
);

const ParallaxIcon = ({ icon: Icon, scrollY, speed, top, left, size, rotate, baseOpacity }) => {
  const yOffset = useTransform(scrollY, [0, 1000], [0, speed * 200]);
  
  return (
    <motion.div
      style={{ y: yOffset }}
      className="absolute pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: baseOpacity, rotate: [rotate, rotate + 5, rotate] }}
      transition={{ 
        opacity: { duration: 2, ease: "easeOut" },
        rotate: { duration: 10 + Math.random() * 10, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div 
        className="text-white/20 backdrop-blur-sm p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] bg-white/5 flex items-center justify-center"
        style={{ top, left, transform: `rotate(${rotate}deg)` }}
      >
        <Icon size={size} className="text-white drop-shadow-md" />
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { scrollY } = useScroll();

  const handleGetStarted = () => {
    if (user) {
      navigate('/catalog');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] overflow-hidden selection:bg-primary-500/30 selection:text-white font-sans text-slate-100">
      
      {/* Dynamic Hero Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Modern, bright digital library image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80")', // Bright modern library architecture
            opacity: 0.6,
            y: useTransform(scrollY, [0, 1000], [0, 150]) // Main background parallax
          }}
        />
        
        {/* Soft, professional gradient overlays (no harsh blues/blacks) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/70 to-[#020617]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-[#020617]/80"></div>
        <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/5 via-transparent to-transparent"></div>
        
        {/* Floating Parallax SaaS Elements */}
        <div className="absolute inset-0 overflow-hidden perspective-1000">
          <div className="absolute top-[15%] left-[10%]"><ParallaxIcon icon={BookOpen} scrollY={scrollY} speed={-0.3} size={48} rotate={-15} baseOpacity={0.8} /></div>
          <div className="absolute top-[25%] right-[15%]"><ParallaxIcon icon={BrainCircuit} scrollY={scrollY} speed={-0.5} size={64} rotate={10} baseOpacity={0.6} /></div>
          <div className="absolute top-[60%] left-[15%]"><ParallaxIcon icon={Database} scrollY={scrollY} speed={-0.2} size={40} rotate={-5} baseOpacity={0.7} /></div>
          <div className="absolute top-[70%] right-[10%]"><ParallaxIcon icon={Network} scrollY={scrollY} speed={-0.6} size={56} rotate={15} baseOpacity={0.5} /></div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center px-6 pt-20">
        {/* Navigation Bar */}
        <nav className="absolute top-0 w-full p-6 lg:px-10 flex justify-between items-center max-w-[90rem] mx-auto left-0 right-0">
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md shadow-sm">
              <Library className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">NexusLib</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <button 
              onClick={handleGetStarted}
              className="text-slate-200 font-medium text-sm px-5 py-2.5 rounded-lg border border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/80 transition-colors duration-300 backdrop-blur-md shadow-sm"
            >
              {user ? 'Go to Dashboard' : 'Sign In'}
            </button>
          </motion.div>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-5xl mx-auto mt-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-medium text-xs mb-8 backdrop-blur-md shadow-sm">
              <Sparkles size={14} className="text-primary-400" /> Introducing the intelligent library
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tighter leading-[1.05] drop-shadow-lg">
              The platform for <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-300 to-slate-500">
                modern knowledge.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-12 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              A comprehensive, AI-powered operating system for your library. Automate tracking, predict trends, and deliver intelligent recommendations to every reader.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-base rounded-2xl transition-transform duration-300 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.4)] hover:-translate-y-0.5"
              >
                Start Exploring <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700 text-slate-200 font-medium text-base rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md shadow-sm"
              >
                View Features
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SaaS Bento-Box Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#020617]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="text-left md:text-center mb-20 max-w-3xl md:mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6 tracking-tight">Everything you need to run a digital-first library.</h2>
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Replace fragmented systems with a single, elegant platform designed to handle the complexity of modern library management effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BentoCard 
              icon={Sparkles}
              title="AI Discovery Engine"
              description="Our deeply integrated intelligence analyzes massive datasets of reading histories to recommend the absolute best literature to every unique user."
              colSpan="md:col-span-2"
              delay={0.1}
            />
            <BentoCard 
              icon={Search}
              title="Omni-Search"
              description="A lightning-fast, highly accurate search that spans across deep descriptions and metadata."
              colSpan="md:col-span-1"
              delay={0.2}
            />
            <BentoCard 
              icon={Bot}
              title="Automated Operations"
              description="Eliminate manual tracking. Our system detects overdues, assigns fines, and handles the lifecycle autonomously."
              colSpan="md:col-span-1"
              delay={0.3}
            />
            <BentoCard 
              icon={BarChart3}
              title="Real-time Analytics"
              description="Visualize the pulse of your institution with comprehensive, real-time dashboards tracking issuing trends and inventory health."
              colSpan="md:col-span-2"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-800 bg-[#020617]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Library className="text-slate-500" size={20} />
            <span className="text-slate-300 font-bold tracking-tight">NexusLib</span>
          </div>
          <p className="text-slate-500 font-medium text-sm">© {new Date().getFullYear()} NexusLib Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
