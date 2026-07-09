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
    <div className="min-h-screen bg-[#0B0F17] text-white font-sans relative overflow-x-hidden selection:bg-pink-500/35 selection:text-white">
      {/* Background radial glow accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-[#EC4899]/8 animate-pulse rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || activeTab !== 'home'
            ? 'bg-[#090D16]/90 backdrop-blur-xl border-b border-white/10 py-3.5 shadow-xl shadow-black/40' 
            : 'bg-[#0B0F17]/40 backdrop-blur-md border-b border-white/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo brand */}
          <div 
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-violet-500 flex items-center justify-center border border-white/10 shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform duration-200">
              <Sparkles size={18} className="text-white animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              HerHorizon
            </span>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-white/5 border border-white/5 p-1 rounded-full backdrop-blur-md">
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
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-pink-300'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
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
              className="relative group overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-[1px] focus:outline-none"
            >
              <span className="relative block px-6 py-2 rounded-full bg-[#0B0F17] text-xs font-bold transition-colors group-hover:bg-transparent text-white">
                Launch App
              </span>
            </button>
          </div>

          {/* Mobile Hamburguer button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
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
              className="lg:hidden border-t border-white/5 bg-[#0B0F17]/95 backdrop-blur-xl px-6 py-6 space-y-3"
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
                      ? 'bg-purple-500/15 border-purple-500/30 text-pink-400'
                      : 'bg-white/5 border-transparent text-slate-400'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTabChange('chat')}
                className="w-full text-center text-xs font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 py-3.5 rounded-xl block text-white shadow-lg shadow-pink-500/10"
              >
                Launch App
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Container */}
      <main className="pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-pink-400 text-xs font-semibold">
                    <Sparkles size={14} className="text-pink-400 animate-spin" />
                    UN SDG 5 Gender Equality Partner
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                    Her Future. Her Wealth. <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">Her Worth.</span>
                  </h1>

                  <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                    Closing the wage gap, funding female-led innovation, and building her custom path into technical leadership.
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('equalizer')}
                      className="bg-gradient-to-r from-pink-500 via-purple-600 to-violet-500 text-white font-bold text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={16} />
                      Explore Salary Equalizer (Hero Feature)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('grants')}
                      className="bg-white/5 border border-white/10 text-slate-300 font-bold text-sm py-3.5 px-6 rounded-2xl hover:bg-white/10 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      Find STEM Grants
                      <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Right Hero Interactive 3D Floating Dashboard Card */}
                <div className="lg:col-span-5 relative flex justify-center">
                  {/* Floating geometric glow rings background */}
                  <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none animate-pulse" />
                  
                  {/* Glassmorphic 3D Dashboard Preview card */}
                  <motion.div 
                    initial={{ y: 0 }}
                    animate={{ y: [-8, 8, -8] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl shadow-black/40 text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />
                    
                    {/* Header preview row */}
                    <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Target Metrics</span>
                        <h4 className="text-sm font-bold text-white">Closing the Gap | Her Horizon</h4>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {/* Numeric Indicators */}
                    <div className="space-y-4">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">STEM Grants Discovered</span>
                          <span className="text-xl font-bold font-mono text-emerald-400">$1.2M+</span>
                        </div>
                        <Award size={20} className="text-emerald-400" />
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Avg Salary Negotiation Lift</span>
                          <span className="text-xl font-bold font-mono text-pink-400">24% Lift</span>
                        </div>
                        <TrendingUp size={20} className="text-pink-400" />
                      </div>

                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase block">Women Mentored</span>
                          <span className="text-xl font-bold font-mono text-purple-400">15,000+</span>
                        </div>
                        <Sparkles size={20} className="text-purple-400 animate-pulse" />
                      </div>
                    </div>

                    {/* Little bottom tip bar */}
                    <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Refreshed: Real-Time</span>
                      <span>Verified: IEEE WIE / SDG 5</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Empowerment Banner Strip / Glowing Ticker */}
              <div className="w-full relative py-8 overflow-hidden border-y border-white/5 bg-gradient-to-r from-transparent via-white/5 to-transparent">
                <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0F17] to-transparent z-20 pointer-events-none" />
                <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0F17] to-transparent z-20 pointer-events-none" />

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
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-md shadow-pink-500/50" />
                        <div>
                          <span className="text-xs font-extrabold text-white uppercase block leading-none">{badge.label}</span>
                          <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider mt-0.5 block">{badge.desc}</span>
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
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-md shadow-pink-500/50" />
                        <div>
                          <span className="text-xs font-extrabold text-white uppercase block leading-none">{badge.label}</span>
                          <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider mt-0.5 block">{badge.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Ecosystem Grid Section */}
              <div className="text-center space-y-12">
                <div className="max-w-2xl mx-auto space-y-3">
                  <h2 className="text-3xl font-bold tracking-tight text-white">An Integrated Empowerment Suite</h2>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Four modules designed and optimized to accelerate women into technical leadership roles, ensuring economic and professional equality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {[
                    {
                      id: 'equalizer',
                      icon: <TrendingUp size={22} className="text-pink-400" />,
                      title: 'FinTech Equalizer',
                      desc: 'Compare and audit compensation, discover pay-gaps, and rehearsal rebuttal strategies.'
                    },
                    {
                      id: 'grants',
                      icon: <Award size={22} className="text-purple-400" />,
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
                      icon: <MessageSquare size={22} className="text-violet-400 animate-pulse" />,
                      title: 'Ask-Her-AI',
                      desc: 'Warm, encouraging virtual AI mentorship answering complex negotiation/tenure questions.'
                    }
                  ].map((feature) => (
                    <div 
                      key={feature.id}
                      onClick={() => handleTabChange(feature.id as TabType)}
                      className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl cursor-pointer hover:border-pink-500/30 transition-all duration-300 shadow-md shadow-black/15 group relative flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                          {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                      <span className="text-[11px] font-semibold text-pink-400 mt-5 flex items-center gap-0.5 hover:translate-x-1 transition-transform">
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
          <div className="mt-6 border-t border-white/5 pt-10" id="workspace-container">
            {/* Tiny navigation path indicator */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-8 justify-start text-left">
              <span className="hover:text-white cursor-pointer" onClick={() => handleTabChange('home')}>HerHorizon Hub</span>
              <span>/</span>
              <span className="text-white uppercase font-bold tracking-wider">
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
      <footer className="border-t border-white/5 py-8 mt-20 text-center text-xs text-slate-600 relative z-10 bg-[#0B0F17]/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} HerHorizon Capital Alliance. Empowering women in STEM under UN SDG 5 Guidelines.</p>
          <div className="flex gap-4 font-mono text-[10px] uppercase">
            <span className="hover:text-slate-400 cursor-pointer">SDG 5 Accord</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Confidentiality Protocol</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Assistant Widget Modal */}
      <AskHerAIWidget />
    </div>
  );
}
