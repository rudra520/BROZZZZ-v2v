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
  Plus,
  Send,
  Code
} from 'lucide-react';
import FintechEqualizer from './components/FintechEqualizer';
import EduGrantHub from './components/EduGrantHub';
import AICareerPath from './components/AICareerPath';
import AskHerAI from './components/AskHerAI';
import AskHerAIWidget from './components/AskHerAIWidget';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip 
} from 'recharts';

type TabType = 'home' | 'equalizer' | 'grants' | 'career' | 'chat';

// SDG 5 Impact data structured as pentagonal metrics for visual depth
const sdgData = [
  {
    subject: 'Pay Parity',
    impact: 74,
    global: 62,
    fullMark: 100,
  },
  {
    subject: 'Leadership',
    impact: 40,
    global: 28,
    fullMark: 100,
  },
  {
    subject: 'Grant Match',
    impact: 82,
    global: 35,
    fullMark: 100,
  },
  {
    subject: 'AI Mentoring',
    impact: 90,
    global: 15,
    fullMark: 100,
  },
  {
    subject: 'Skill Mastery',
    impact: 68,
    global: 30,
    fullMark: 100,
  },
];

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/95 border border-zinc-800 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs font-bold text-white mb-2 font-mono">{payload[0].payload.subject}</p>
        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex items-center justify-between gap-6 text-[#E841A1]">
            <span>HerHorizon Impact:</span>
            <span className="font-bold">{payload[0].value}%</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-[#00FFA3]">
            <span>Global Baseline:</span>
            <span className="font-bold">{payload[1].value}%</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-zinc-400">
            <span>Target Goal:</span>
            <span className="font-bold">100%</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chartInView, setChartInView] = useState(false);

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
    <div className="min-h-screen bg-[#0B0A11] text-white font-sans relative overflow-x-hidden selection:bg-[#A144FF]/35 selection:text-white">
      {/* Background radial glow accents container to prevent horizontal blowout */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#A144FF]/5 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[45%] h-[45%] bg-[#E841A1]/4 animate-pulse rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#00FFA3]/3 rounded-full blur-[140px]" />
      </div>

      {/* Header Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || activeTab !== 'home'
            ? 'bg-[#0B0A11]/90 backdrop-blur-xl border-b border-zinc-800/80 py-3.5 shadow-xl shadow-black/40' 
            : 'bg-[#0B0A11]/40 backdrop-blur-md border-b border-zinc-900/40 py-5'
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
              { id: 'equalizer', label: 'HorizonPath AI', icon: <TrendingUp size={13} /> },
              { id: 'grants', label: 'EduGrant Hub', icon: <Award size={13} /> },
              { id: 'career', label: 'AI Career Path', icon: <Map size={13} /> },
              { id: 'chat', label: 'Dea AI', icon: <MessageSquare size={13} /> }
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
              className="bg-[#A144FF] hover:bg-[#A144FF]/95 text-white shadow-md shadow-[#A144FF]/20 px-6 py-2 text-xs font-bold rounded-full transition-all duration-200"
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
              className="lg:hidden border-t border-zinc-800 bg-[#0B0A11]/95 backdrop-blur-xl px-6 py-6 space-y-3"
            >
              {[
                { id: 'equalizer', label: 'HorizonPath AI', icon: <TrendingUp size={15} /> },
                { id: 'grants', label: 'EduGrant Hub', icon: <Award size={15} /> },
                { id: 'career', label: 'AI Career Path', icon: <Map size={15} /> },
                { id: 'chat', label: 'Dea AI', icon: <MessageSquare size={15} /> }
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
                className="w-full text-center text-xs font-extrabold bg-[#A144FF] hover:bg-[#A144FF]/90 text-white py-3.5 rounded-xl block transition-colors"
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
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1437]/60 border border-[#A144FF]/20 rounded-full text-[#A5A1B8] text-xs font-semibold">
                    <Sparkles size={13} className="text-[#E841A1] animate-pulse" />
                    UN SDG 5 Gender Equality Partner
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif tracking-tight leading-[1.15] text-white font-medium">
                    Her Future. Her Wealth. <span className="italic font-normal text-[#E841A1] drop-shadow-[0_0_15px_rgba(232,65,161,0.2)]">Her Worth.</span>
                  </h1>
 
                  <p className="text-base sm:text-lg text-[#A5A1B8] max-w-2xl leading-relaxed">
                    Closing the wage gap, funding female-led innovation, and building custom paths into technical leadership.
                  </p>
 
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('equalizer')}
                      className="bg-gradient-to-r from-[#A144FF] to-[#8b5cf6] hover:brightness-110 text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-[#A144FF]/10 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={16} />
                      Explore HorizonPath AI (Hero Feature)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('grants')}
                      className="bg-[#1F1437]/80 border border-[#A144FF]/30 text-white hover:bg-[#1F1437] font-bold text-sm py-3.5 px-6 rounded-xl active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      Find STEM Grants
                      <ArrowRight size={16} className="text-[#A5A1B8] group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
 
                {/* Right Hero Bento Grid - Metric Modernization */}
                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 w-full">
                  {/* Metric Card 1 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#1F1437]/40 backdrop-blur-md border border-[#A144FF]/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[#A144FF]/30 transition-all duration-200 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-[#A5A1B8] font-mono uppercase tracking-wider">Metrics | Discovery</span>
                      <div className="p-1.5 bg-[#1F1437]/80 border border-[#A144FF]/15 rounded-lg">
                        <Award size={14} className="text-[#00FFA3]" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-[#00FFA3] block">$1.2M+</span>
                      <span className="text-xs text-[#A5A1B8] mt-1 block font-medium">STEM Grants Discovered</span>
                    </div>
                  </motion.div>
 
                  {/* Metric Card 2 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#1F1437]/40 backdrop-blur-md border border-[#A144FF]/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[#A144FF]/30 transition-all duration-200 relative group overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-[#A5A1B8] font-mono uppercase tracking-wider">Metrics | Equalizer</span>
                      <div className="p-1.5 bg-[#1F1437]/80 border border-[#A144FF]/15 rounded-lg">
                        <TrendingUp size={14} className="text-[#E841A1]" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-[#E841A1] block">24% Lift</span>
                      <span className="text-xs text-[#A5A1B8] mt-1 block font-medium">Avg Salary Negotiation Increase</span>
                    </div>
                  </motion.div>
 
                  {/* Metric Card 3 */}
                  <motion.div 
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#1F1437]/40 backdrop-blur-md border border-[#A144FF]/10 p-5 rounded-2xl flex flex-col justify-between hover:border-[#A144FF]/30 transition-all duration-200 relative group overflow-hidden sm:col-span-2 lg:col-span-1"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] text-[#A5A1B8] font-mono uppercase tracking-wider">Metrics | Outreach</span>
                      <div className="p-1.5 bg-[#1F1437]/80 border border-[#A144FF]/15 rounded-lg">
                        <Sparkles size={14} className="text-[#A144FF] animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <span className="text-3xl font-bold font-mono tracking-tight text-[#A144FF] block">15,000+</span>
                      <span className="text-xs text-[#A5A1B8] mt-1 block font-medium">Women Actively Mentored</span>
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
                  <h2 className="text-3xl font-bold tracking-tight text-white font-serif">An Integrated Empowerment Suite</h2>
                  <p className="text-sm text-[#A5A1B8] leading-relaxed">
                    Four modules designed and optimized to accelerate women into technical leadership roles, ensuring economic and professional equality.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                  {[
                    {
                      id: 'equalizer',
                      icon: <TrendingUp size={22} className="text-[#00FFA3]" />,
                      title: 'HorizonPath AI',
                      desc: 'Compare and audit compensation, discover pay-gaps, and rehearse rebuttal strategies.'
                    },
                    {
                      id: 'grants',
                      icon: <Award size={22} className="text-[#E841A1]" />,
                      title: 'EduGrant Hub',
                      desc: 'Database of academic funding resources with customized AI application statements.'
                    },
                    {
                      id: 'career',
                      icon: <Map size={22} className="text-[#00FFA3]" />,
                      title: 'AI Career Path',
                      desc: '4-step engineering curriculums custom-planned by Gemini to help you acquire strategic technical skills.'
                    },
                    {
                      id: 'chat',
                      icon: <MessageSquare size={22} className="text-[#A144FF] animate-pulse" />,
                      title: 'Dea AI',
                      desc: 'A warm, encouraging virtual mentor answering complex negotiation and tenure questions.'
                    }
                  ].map((feature) => (
                    <div 
                      key={feature.id}
                      onClick={() => handleTabChange(feature.id as TabType)}
                      className="p-6 bg-[#1F1437]/30 backdrop-blur-md border border-[#A144FF]/10 rounded-2xl cursor-pointer hover:border-[#A144FF]/35 hover:bg-[#1F1437]/50 transition-all duration-300 shadow-sm group relative flex flex-col justify-between"
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#A144FF]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#1F1437]/70 border border-[#A144FF]/15 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                          {feature.icon}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-xs text-[#A5A1B8] leading-relaxed mb-4">{feature.desc}</p>

                        {/* Interactive UI additions based on hackathon request */}
                        {feature.id === 'career' && (
                          <div className="mt-4 pt-4 border-t border-[#A144FF]/10 space-y-2">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#00FFA3] block font-bold">Curriculum Preview</span>
                            <div className="space-y-1.5 font-sans text-[11px]">
                              <div className="flex items-center gap-1.5 text-white/90">
                                <span className="w-4 h-4 rounded-full bg-[#00FFA3]/20 text-[#00FFA3] flex items-center justify-center font-mono text-[9px] font-bold">1</span>
                                <span className="truncate">System Design Architecture Fundamentals</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-[9px] font-bold">2</span>
                                <span className="truncate">Technical Project Management & Delivery</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-[9px] font-bold">3</span>
                                <span className="truncate">Executive Presence & Board Comms</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-zinc-400">
                                <span className="w-4 h-4 rounded-full bg-zinc-800 text-zinc-500 flex items-center justify-center font-mono text-[9px] font-bold">4</span>
                                <span className="truncate">Strategic Technical Vision & Alignment</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {feature.id === 'chat' && (
                          <div 
                            className="mt-4 pt-4 border-t border-[#A144FF]/10 space-y-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              localStorage.setItem('ask_her_ai_initial_query', "How do I negotiate an out-of-cycle promotion?");
                              handleTabChange('chat');
                            }}
                          >
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A144FF] block font-bold">Pre-loaded Prototype Sandbox</span>
                            <div className="flex items-center justify-between gap-2 p-2 bg-[#1B1231]/60 border border-[#A144FF]/25 rounded-xl hover:border-[#A144FF]/50 transition-colors group/input">
                              <span className="text-[11px] text-[#A5A1B8] truncate select-none">
                                Try asking: "How do I negotiate..."
                              </span>
                              <div className="w-6 h-6 rounded-lg bg-[#A144FF]/20 text-[#A144FF] flex items-center justify-center group-hover/input:bg-[#A144FF] group-hover/input:text-white transition-all">
                                <Send size={11} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-white mt-5 flex items-center gap-0.5 group-hover:translate-x-1 group-hover:text-[#A144FF] transition-all">
                        Access Module <ArrowRight size={12} />
                      </span>
                    </div>
                  ))}
                </div>

                {/* UN SDG 5 Impact Metrics Panel */}
                <div className="border border-zinc-800 bg-zinc-900/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-6 text-left relative overflow-hidden mt-12">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#E841A1]/5 rounded-full blur-2xl" />
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2 font-serif">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E841A1] animate-pulse" />
                        UN SDG 5 Impact Metrics
                      </h3>
                      <p className="text-xs text-[#A5A1B8] mt-0.5">
                        HerHorizon Capital Alliance is structurally integrated with global Gender Equality targets.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E841A1]/15 border border-[#E841A1]/30 rounded-full text-[#E841A1] text-xs font-mono font-bold uppercase tracking-wider">
                      Target Alignment Active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-stretch">
                    {/* Visual Radar Chart */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      onViewportEnter={() => setChartInView(true)}
                      className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/40 rounded-2xl p-5 border border-zinc-800/60 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 p-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Visual Representation</span>
                        <h4 className="text-xs font-bold text-zinc-300 mt-0.5">5-Point Progress Footprint</h4>
                      </div>

                      <div className="w-full h-[260px] flex items-center justify-center mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartInView ? sdgData : sdgData.map(d => ({ ...d, impact: 0, global: 0 }))}>
                            <PolarGrid stroke="#27272a" strokeDasharray="3 3" />
                            <PolarAngleAxis 
                              dataKey="subject" 
                              stroke="#a1a1aa" 
                              fontSize={9} 
                              fontFamily="monospace"
                              tick={{ fill: '#a1a1aa', fontSize: 9 }}
                            />
                            <PolarRadiusAxis 
                              angle={30} 
                              domain={[0, 100]} 
                              stroke="#3f3f46" 
                              fontSize={8} 
                              tickCount={5}
                              tick={{ fill: '#52525b' }}
                            />
                            <Tooltip content={<CustomRadarTooltip />} cursor={false} />
                            <Radar 
                              name="HerHorizon" 
                              dataKey="impact" 
                              stroke="#E841A1" 
                              fill="#E841A1" 
                              fillOpacity={0.3} 
                              strokeWidth={2} 
                              isAnimationActive={true}
                              animationDuration={1500}
                              animationEasing="ease-out"
                            />
                            <Radar 
                              name="Global Average" 
                              dataKey="global" 
                              stroke="#00FFA3" 
                              fill="#00FFA3" 
                              fillOpacity={0.15} 
                              strokeWidth={1.5} 
                              isAnimationActive={true}
                              animationDuration={1500}
                              animationEasing="ease-out"
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Custom Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] font-mono text-zinc-400 mt-2 border-t border-zinc-900 pt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#E841A1]" />
                          <span>HerHorizon ({Math.round(sdgData.reduce((acc, d) => acc + d.impact, 0) / sdgData.length)}%)</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00FFA3]" />
                          <span>Global Baseline ({Math.round(sdgData.reduce((acc, d) => acc + d.global, 0) / sdgData.length)}%)</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* SDG 5 Targets Detailed Cards */}
                    <div className="lg:col-span-7 flex flex-col gap-4 justify-between">
                      {/* Target 5.a */}
                      <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#00FFA3] block font-bold mb-1">
                            Target 5.a • Economic Equality
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1.5">HorizonPath AI</h4>
                          <p className="text-xs text-[#A5A1B8] leading-relaxed">
                            Matches localized compensation data to close wage disparities and secure full economic ownership for women.
                          </p>
                        </div>
                        <div className="mt-3 text-[10px] text-[#A5A1B8] font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#00FFA3] rounded-full" />
                          Audited Pay Parity Strategy
                        </div>
                      </div>

                      {/* Target 5.5 */}
                      <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A144FF] block font-bold mb-1">
                            Target 5.5 • Women in Leadership
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1.5">AI Career Path</h4>
                          <p className="text-xs text-[#A5A1B8] leading-relaxed">
                            Architects strict curriculum paths and skill mastery indicators to transition mid-tier candidates into C-Suite roles.
                          </p>
                        </div>
                        <div className="mt-3 text-[10px] text-[#A5A1B8] font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#A144FF] rounded-full" />
                          Technical Leadership Curriculums
                        </div>
                      </div>

                      {/* Target 5.b */}
                      <div className="p-4 bg-zinc-900/40 rounded-xl border border-zinc-800/60 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E841A1] block font-bold mb-1">
                            Target 5.b • Tech Empowerment
                          </span>
                          <h4 className="text-sm font-bold text-white mb-1.5">EduGrant Hub & Dea AI</h4>
                          <p className="text-xs text-[#A5A1B8] leading-relaxed">
                            Utilizes enabling AI to locate STEM academic grants, streamline proposals, and provide 24/7 strategic mentorship.
                          </p>
                        </div>
                        <div className="mt-3 text-[10px] text-[#A5A1B8] font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#E841A1] rounded-full" />
                          STEM Micro-grants & 24/7 AI Mentor
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Interactive Tools Workspace Container */}
        <div className={`mt-6 border-t border-zinc-900 pt-10 ${activeTab === 'home' ? 'hidden' : ''}`} id="workspace-container">
          {/* Tiny navigation path indicator */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mb-8 justify-start text-left">
            <span className="hover:text-white cursor-pointer" onClick={() => handleTabChange('home')}>HerHorizon Hub</span>
            <span>/</span>
            <span className="text-zinc-100 uppercase font-bold tracking-wider">
              {activeTab === 'equalizer' && 'HorizonPath AI'}
              {activeTab === 'grants' && 'EduGrant Hub'}
              {activeTab === 'career' && 'AI Career Path'}
              {activeTab === 'chat' && 'Dea AI'}
            </span>
          </div>

          <div>
            <div className={activeTab === 'equalizer' ? '' : 'hidden'}>
              <motion.div
                key="equalizer-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={activeTab === 'equalizer' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3 }}
              >
                <FintechEqualizer />
              </motion.div>
            </div>
            <div className={activeTab === 'grants' ? '' : 'hidden'}>
              <motion.div
                key="grants-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={activeTab === 'grants' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3 }}
              >
                <EduGrantHub />
              </motion.div>
            </div>
            <div className={activeTab === 'career' ? '' : 'hidden'}>
              <motion.div
                key="career-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={activeTab === 'career' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3 }}
              >
                <AICareerPath />
              </motion.div>
            </div>
            <div className={activeTab === 'chat' ? '' : 'hidden'}>
              <motion.div
                key="chat-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={activeTab === 'chat' ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3 }}
              >
                <AskHerAI />
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="border-t border-zinc-900 py-8 mt-20 text-center text-xs text-zinc-500 relative z-10 bg-[#0B0A11]/80">
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
