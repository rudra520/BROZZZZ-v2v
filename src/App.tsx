import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  Map, 
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Lock,
  Menu,
  X,
  Plus
} from 'lucide-react';
import FintechEqualizer from './components/FintechEqualizer';
import EduGrantHub from './components/EduGrantHub';
import AICareerPath from './components/AICareerPath';
import AskHerAI from './components/AskHerAI';
import AskHerAIWidget from './components/AskHerAIWidget';

type TabType = 'home' | 'equalizer' | 'grants' | 'career' | 'chat';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scrolling to add subtle glassmorphic styling to header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    
    // Smooth scroll down to the workspace container if switching to a functional tab
    if (tab !== 'home') {
      setTimeout(() => {
        scrollToSection('workspace-container');
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-zinc-100 font-sans relative overflow-x-hidden selection:bg-pink-500/35 selection:text-white">
      {/* Background radial glow accents container to prevent horizontal blowout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A855F7]/4 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-[#EC4899]/3 animate-pulse rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#10B981]/2 rounded-full blur-[140px]" />
      </div>

      {/* Header Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || activeTab !== 'home'
            ? 'bg-[#0B0F17]/90 backdrop-blur-xl border-b border-zinc-800 py-3.5 shadow-xl shadow-black/40' 
            : 'bg-[#0B0F17]/40 backdrop-blur-md border-b border-zinc-900/50 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo brand */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Sparkles size={18} className="text-zinc-100" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-zinc-50">
              HerHorizon
            </span>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/80 p-1 rounded-full backdrop-blur-md">
            {[
              { id: 'equalizer', label: 'FinTech Equalizer', icon: <TrendingUp size={13} /> },
              { id: 'grants', label: 'EduGrant Hub', icon: <Award size={13} /> },
              { id: 'career', label: 'AI Career Path', icon: <Map size={13} /> },
              { id: 'chat', label: 'Ask-Her-AI', icon: <MessageSquare size={13} /> }
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleTabChange(link.id as TabType)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all duration-150 ${
                  activeTab === link.id
                    ? 'bg-zinc-800 border border-zinc-700 text-zinc-50'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                }`}
              >
                {link.icon}
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleTabChange('chat')}
              className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 px-6 py-2 text-xs font-bold rounded-full transition-all duration-200"
            >
              Launch App
            </button>
          </div>

          {/* Mobile Hamburguer button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-zinc-800 bg-[#09090b]/95 backdrop-blur-xl px-6 py-6 space-y-3"
            >
              {[
                { id: 'equalizer', label: 'FinTech Equalizer', icon: <TrendingUp size={15} /> },
                { id: 'grants', label: 'EduGrant Hub', icon: <Award size={15} /> },
                { id: 'career', label: 'AI Career Path', icon: <Map size={15} /> },
                { id: 'chat', label: 'Ask-Her-AI', icon: <MessageSquare size={15} /> }
              ].map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleTabChange(link.id as TabType)}
                  className={`flex items-center gap-3 w-full p-3.5 text-sm font-bold rounded-xl border text-left transition-all ${
                    activeTab === link.id
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                      : 'bg-zinc-900/40 border-transparent text-zinc-400'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTabChange('chat')}
                className="w-full text-center text-xs font-extrabold bg-zinc-50 hover:bg-zinc-200 text-zinc-950 py-3.5 rounded-xl block transition-colors"
              >
                Launch App
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-20 pt-10"
            >
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Hero Headlines */}
                <div className="lg:col-span-7 text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full text-zinc-300 text-xs font-semibold">
                    <Sparkles size={13} className="text-pink-400 animate-pulse" />
                    UN SDG 5 Gender Equality Partner
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.15] text-zinc-50 font-medium">
                    Her Future. Her Wealth. <span className="italic font-normal bg-gradient-to-r from-pink-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">Her Worth.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed">
                    Closing the wage gap, funding female-led innovation, and building her custom path into technical leadership.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('equalizer')}
                      className="bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-bold text-sm py-3.5 px-6 rounded-xl hover:shadow-lg active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={16} />
                      Explore Salary Equalizer (Hero Feature)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('grants')}
                      className="bg-zinc-900/60 border border-zinc-800 text-zinc-300 font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-zinc-800 hover:text-white active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      Find STEM Grants
                      <ArrowRight size={16} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Right Hero Bento Grid - Metric Modernization */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
                  {/* Metric Card 1 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-200 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Metrics | Discovery</span>
                      <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-lg">
                        <Award size={14} className="text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400 block">$1.2M+</span>
                      <span className="text-xs text-zinc-400 mt-1 block font-medium">STEM Grants Discovered</span>
                    </div>
                  </motion.div>

                  {/* Metric Card 2 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-200 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Metrics | Equalizer</span>
                      <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-lg">
                        <TrendingUp size={14} className="text-pink-400" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-pink-400 block">24% Lift</span>
                      <span className="text-xs text-zinc-400 mt-1 block font-medium">Avg Salary Negotiation Increase</span>
                    </div>
                  </motion.div>

                  {/* Metric Card 3 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700/50 transition-all duration-200 relative group overflow-hidden sm:col-span-2 lg:col-span-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Metrics | Outreach</span>
                      <div className="p-1.5 bg-zinc-800/80 border border-zinc-700/50 rounded-lg">
                        <Sparkles size={14} className="text-purple-400 animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-purple-400 block">15,000+</span>
                      <span className="text-xs text-zinc-400 mt-1 block font-medium">Women Active Mentored</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Seamless Infinite Marquee Ticker */}
              <div 
                className="w-full relative py-8 overflow-hidden border-y border-zinc-800 bg-zinc-900/10"
                style={{
                  width: '100%',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)'
                }}
              >
                <div className="flex select-none">
                  <div className="flex shrink-0 items-center gap-12 animate-scroll">
                    {[
                      { label: 'UN SDG 5 Alignment', desc: 'Gender Equality Standard' },
                      { label: 'IEEE WIE Badge Holder', desc: 'Women in Engineering' },
                      { label: 'AnitaB.org Alliance', desc: 'Advocate Partner' },
                      { label: 'DeepMind Fellowship', desc: 'STEM Core Sponsor' },
                      { label: 'Gemini AI Integration', desc: 'Secure Server Core' },
                      { label: 'FinTech Equalizer Charter', desc: 'Closing pay gaps' }
                    ].map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        <div>
                          <span className="text-xs font-bold text-zinc-200 uppercase block leading-none">{badge.label}</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider mt-0.5 block">{badge.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex shrink-0 items-center gap-12 animate-scroll" aria-hidden="true">
                    {[
                      { label: 'UN SDG 5 Alignment', desc: 'Gender Equality Standard' },
                      { label: 'IEEE WIE Badge Holder', desc: 'Women in Engineering' },
                      { label: 'AnitaB.org Alliance', desc: 'Advocate Partner' },
                      { label: 'DeepMind Fellowship', desc: 'STEM Core Sponsor' },
                      { label: 'Gemini AI Integration', desc: 'Secure Server Core' },
                      { label: 'FinTech Equalizer Charter', desc: 'Closing pay gaps' }
                    ].map((badge, idx) => (
                      <div key={`dup-${idx}`} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                        <div>
                          <span className="text-xs font-bold text-zinc-200 uppercase block leading-none">{badge.label}</span>
                          <span className="text-[9px] text-zinc-500 uppercase font-mono tracking-wider mt-0.5 block">{badge.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Ecosystem Grid Section */}
              <div className="text-center space-y-12">
                <div className="max-w-2xl mx-auto space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight text-zinc-50 font-serif">An Integrated Empowerment Suite</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Four modules designed and optimized to accelerate women into technical leadership roles, ensuring economic and professional equality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {[
                    {
                      id: 'equalizer',
                      icon: <TrendingUp size={22} className="text-emerald-400" />,
                      title: 'FinTech Equalizer',
                      desc: 'Compare and audit compensation, discover pay-gaps, and rehearsal rebuttal strategies.'
                    },
                    {
                      id: 'grants',
                      icon: <Award size={22} className="text-pink-400" />,
                      title: 'EduGrant Hub',
                      desc: 'Database of academic funding resources with customized AI application statements.'
                    },
                    {
                      id: 'career',
                      icon: <Map size={22} className="text-emerald-400" />,
                      title: 'AI Career Path',
                      desc: '4-step engineering curriculums custom-planned by Gemini to acquire strategic skills.'
                    },
                    {
                      id: 'chat',
                      icon: <MessageSquare size={22} className="text-purple-400 animate-pulse" />,
                      title: 'Ask-Her-AI',
                      desc: 'Warm, encouraging virtual AI mentorship answering complex negotiation/tenure questions.'
                    }
                  ].map((feature) => (
                    <div 
                      key={feature.id}
                      onClick={() => handleTabChange(feature.id as TabType)}
                      className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800 rounded-2xl cursor-pointer hover:border-zinc-700/50 hover:bg-zinc-900/60 transition-all duration-300 shadow-sm group relative flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/2 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                          {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold text-zinc-100 mb-2">{feature.title}</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{feature.desc}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-zinc-200 mt-5 flex items-center gap-0.5 group-hover:translate-x-1 group-hover:text-zinc-50 transition-all">
                        Access Module <ArrowRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Interactive Tools Workspace Container */}
        {activeTab !== 'home' && (
          <div className="mt-6 border-t border-zinc-900 pt-10" id="workspace-container">
            {/* Tiny navigation path indicator */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-8 justify-start text-left">
              <span className="hover:text-white cursor-pointer" onClick={() => handleTabChange('home')}>HerHorizon Hub</span>
              <span>/</span>
              <span className="text-zinc-100 uppercase font-bold tracking-wider">
                {activeTab === 'equalizer' && 'FinTech Equalizer'}
                {activeTab === 'grants' && 'EduGrant Hub'}
                {activeTab === 'career' && 'AI Career Path'}
                {activeTab === 'chat' && 'Ask-Her-AI'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'equalizer' && (
                <motion.div
                  key="equalizer-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <FintechEqualizer />
                </motion.div>
              )}
              {activeTab === 'grants' && (
                <motion.div
                  key="grants-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <EduGrantHub />
                </motion.div>
              )}
              {activeTab === 'career' && (
                <motion.div
                  key="career-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <AICareerPath />
                </motion.div>
              )}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <AskHerAI />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-zinc-900 py-8 mt-20 text-center text-xs text-zinc-500 relative z-10 bg-[#0B0F17]/80">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HerHorizon Capital Alliance. Empowering women in STEM under UN SDG 5 Guidelines.</p>
          <div className="flex gap-4 font-mono text-[10px] uppercase">
            <span className="hover:text-zinc-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-zinc-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Widget Modal */}
      <AskHerAIWidget />
    </div>
  );
}
