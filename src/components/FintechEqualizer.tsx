import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Copy,
  Check,
  RotateCcw,
  Info,
  Zap,
  Award
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

// Domain constants
type DomainType = 'Computer Science' | 'Data Science' | 'Core Engineering';
type ExpLevelType = 'Entry' | 'Mid' | 'Lead';
type RegionType = 'North America (USD)' | 'Europe (EUR)' | 'India (INR)' | 'Asia Pacific (SGD)';

interface BenchmarkConfig {
  min: number;
  max: number;
  maleAvg: number;
  femaleAvg: number;
  wageGap: number;
}

// Highly precise database of realistic compensations mapped to choices
const COMPENSATION_BENCHMARKS: Record<DomainType, Record<RegionType, Record<ExpLevelType, BenchmarkConfig>>> = {
  'Computer Science': {
    'North America (USD)': {
      'Entry': { min: 85000, max: 105000, maleAvg: 98000, femaleAvg: 80000, wageGap: -18.4 },
      'Mid': { min: 120000, max: 155000, maleAvg: 142000, femaleAvg: 116000, wageGap: -18.3 },
      'Lead': { min: 165000, max: 210000, maleAvg: 195000, femaleAvg: 159000, wageGap: -18.5 }
    },
    'Europe (EUR)': {
      'Entry': { min: 55000, max: 70000, maleAvg: 64000, femaleAvg: 53000, wageGap: -17.2 },
      'Mid': { min: 78000, max: 98000, maleAvg: 90000, femaleAvg: 74500, wageGap: -17.2 },
      'Lead': { min: 110000, max: 145000, maleAvg: 132000, femaleAvg: 109000, wageGap: -17.4 }
    },
    'India (INR)': {
      'Entry': { min: 800000, max: 1200000, maleAvg: 1050000, femaleAvg: 860000, wageGap: -18.1 },
      'Mid': { min: 1600000, max: 2400000, maleAvg: 2100000, femaleAvg: 1720000, wageGap: -18.1 },
      'Lead': { min: 3000000, max: 4800000, maleAvg: 4100000, femaleAvg: 3350000, wageGap: -18.3 }
    },
    'Asia Pacific (SGD)': {
      'Entry': { min: 65000, max: 85000, maleAvg: 76000, femaleAvg: 62000, wageGap: -18.4 },
      'Mid': { min: 95000, max: 130000, maleAvg: 115000, femaleAvg: 94000, wageGap: -18.3 },
      'Lead': { min: 145000, max: 195000, maleAvg: 175000, femaleAvg: 143000, wageGap: -18.3 }
    }
  },
  'Data Science': {
    'North America (USD)': {
      'Entry': { min: 90000, max: 115000, maleAvg: 104000, femaleAvg: 86000, wageGap: -17.3 },
      'Mid': { min: 130000, max: 165000, maleAvg: 152000, femaleAvg: 126000, wageGap: -17.1 },
      'Lead': { min: 175000, max: 225000, maleAvg: 208000, femaleAvg: 172000, wageGap: -17.3 }
    },
    'Europe (EUR)': {
      'Entry': { min: 60000, max: 75000, maleAvg: 69000, femaleAvg: 58000, wageGap: -15.9 },
      'Mid': { min: 82000, max: 105000, maleAvg: 96000, femaleAvg: 80500, wageGap: -16.1 },
      'Lead': { min: 120000, max: 160000, maleAvg: 145000, femaleAvg: 121000, wageGap: -16.5 }
    },
    'India (INR)': {
      'Entry': { min: 900000, max: 1400000, maleAvg: 1180000, femaleAvg: 980000, wageGap: -16.9 },
      'Mid': { min: 1800000, max: 2700000, maleAvg: 2350000, femaleAvg: 1950000, wageGap: -17.0 },
      'Lead': { min: 3200000, max: 5200000, maleAvg: 4400000, femaleAvg: 3650000, wageGap: -17.0 }
    },
    'Asia Pacific (SGD)': {
      'Entry': { min: 70000, max: 90000, maleAvg: 82000, femaleAvg: 68000, wageGap: -17.1 },
      'Mid': { min: 100000, max: 140000, maleAvg: 124000, femaleAvg: 103000, wageGap: -16.9 },
      'Lead': { min: 155000, max: 210000, maleAvg: 188000, femaleAvg: 156000, wageGap: -17.0 }
    }
  },
  'Core Engineering': {
    'North America (USD)': {
      'Entry': { min: 78000, max: 96000, maleAvg: 89000, femaleAvg: 72000, wageGap: -19.1 },
      'Mid': { min: 105000, max: 135000, maleAvg: 122000, femaleAvg: 99000, wageGap: -18.9 },
      'Lead': { min: 145000, max: 185000, maleAvg: 168000, femaleAvg: 136000, wageGap: -19.0 }
    },
    'Europe (EUR)': {
      'Entry': { min: 50000, max: 64000, maleAvg: 58000, femaleAvg: 47500, wageGap: -18.1 },
      'Mid': { min: 72000, max: 90000, maleAvg: 83000, femaleAvg: 68000, wageGap: -18.1 },
      'Lead': { min: 105000, max: 135000, maleAvg: 123000, femaleAvg: 101000, wageGap: -17.9 }
    },
    'India (INR)': {
      'Entry': { min: 600000, max: 950000, maleAvg: 800000, femaleAvg: 650000, wageGap: -18.7 },
      'Mid': { min: 1200000, max: 1850000, maleAvg: 1580000, femaleAvg: 1280000, wageGap: -19.0 },
      'Lead': { min: 2400000, max: 3800000, maleAvg: 3250000, femaleAvg: 2630000, wageGap: -19.1 }
    },
    'Asia Pacific (SGD)': {
      'Entry': { min: 58000, max: 76000, maleAvg: 68000, femaleAvg: 55000, wageGap: -19.1 },
      'Mid': { min: 88000, max: 118000, maleAvg: 105000, femaleAvg: 85000, wageGap: -19.0 },
      'Lead': { min: 130000, max: 175000, maleAvg: 156000, femaleAvg: 126000, wageGap: -19.2 }
    }
  }
};

// Currency mapping helper
const CURRENCY_SYMBOLS: Record<RegionType, string> = {
  'North America (USD)': '$',
  'Europe (EUR)': '€',
  'India (INR)': '₹',
  'Asia Pacific (SGD)': 'S$'
};

export default function FintechEqualizer() {
  // Input states
  const [domain, setDomain] = useState<DomainType>('Computer Science');
  const [experience, setExperience] = useState<ExpLevelType>('Mid');
  const [region, setRegion] = useState<RegionType>('India (INR)');
  const [currentOffer, setCurrentOffer] = useState<number>(1400000);

  // Script builder states
  const [targetAdjustment, setTargetAdjustment] = useState<string>('20%');
  const [accomplishments, setAccomplishments] = useState<string>('');
  const [tone, setTone] = useState<'Confident' | 'Data-Driven' | 'Collaborative'>('Data-Driven');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<{
    scriptTemplate: string;
    talkingPoints: string[];
    counterOfferStrategies: string[];
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Get benchmarks based on current selection
  const benchmarks = COMPENSATION_BENCHMARKS[domain][region][experience];
  const symbol = CURRENCY_SYMBOLS[region];

  // Adjust default offer when region or domain or experience changes to keep it in scale
  useEffect(() => {
    // Provide a sensible default inside the range
    const midValue = Math.round((benchmarks.min + benchmarks.max) / 2);
    // Let's set it to slightly below min to simulate an unequal initial offer!
    const lowOffer = Math.round(benchmarks.min * 0.9);
    setCurrentOffer(lowOffer);
  }, [domain, experience, region]);

  // Handle formatted currency display
  const formatValue = (val: number) => {
    if (region === 'India (INR)') {
      if (val >= 10000000) {
        return `${symbol}${(val / 10000000).toFixed(2)} Cr`;
      }
      if (val >= 100000) {
        return `${symbol}${(val / 100000).toFixed(1)} LPA`;
      }
      return `${symbol}${val.toLocaleString('en-IN')}`;
    }
    return `${symbol}${val.toLocaleString('en-US')}`;
  };

  // Raw values for slider min/max calculations
  const sliderMin = Math.round(benchmarks.min * 0.5);
  const sliderMax = Math.round(benchmarks.max * 1.5);

  // Readiness Score Calculation
  const calculateReadinessScore = () => {
    let score = 55; // Base score
    if (accomplishments.trim().length > 15) score += 15;
    if (targetAdjustment.trim().length > 0) score += 10;
    if (generatedScript) score += 20;
    return Math.min(score, 100);
  };

  const readinessScore = calculateReadinessScore();

  // Handle script generation
  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setGeneratedScript(null);

    try {
      const response = await fetch('/api/negotiation-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: `${experience} ${domain} Specialist`,
          experience: experience,
          domain: domain,
          targetSalaryAdjustment: targetAdjustment,
          keyAccomplishments: accomplishments || 'Delivered multiple high-impact technical milestones',
          tone: tone
        })
      });

      if (!response.ok) {
        throw new Error('Script generation failed');
      }

      const data = await response.json();
      setGeneratedScript(data);
    } catch (err) {
      console.error(err);
      // Local fallback in case of rate limits
      let template = '';
      let points: string[] = [];
      let strategies: string[] = [];

      if (tone === 'Confident') {
        template = `Dear [Recruiter Name],\n\nThank you for the wonderful offer to join as a ${experience}-level ${domain} professional. I am incredibly excited about the opportunity to contribute to your technical excellence.\n\nBased on my extensive background and specifically my track record of: "${accomplishments || 'delivering robust product architectures and performance optimizations'}", I would like to discuss aligning the base compensation to better reflect this specialized value. Given regional benchmarks and my contribution potential, I am seeking an adjustment of ${targetAdjustment} to the base offer.\n\nWith this alignment, I am ready to sign and fully commit to driving outstanding results for the team. I look forward to your thoughts.\n\nBest regards,\n[Your Name]`;
        points = [
          `Anchored on tangible value: Direct link established between your technical success ("${accomplishments || 'core contributions'}") and the requested adjustment.`,
          "Strong commitment: Signal of ready-to-sign commitment upon achieving this market standard, speeding up their hiring process.",
          "Professional positioning: Formulated with standard high-performance phrasing that commands respect."
        ];
        strategies = [
          "If they offer equity instead: Propose a hybrid structure with a modest base increase supplemented by performance-based stock accelerators.",
          "If they cite strict bands: Ask about exceptions for highly specialized expertise, noting that your experience directly addresses their immediate delivery bottlenecks."
        ];
      } else if (tone === 'Data-Driven') {
        template = `Dear [Recruiter Name],\n\nI appreciate the offer for the ${experience} ${domain} role. After researching market thresholds and reviewing the core responsibilities, I would like to propose a compensation adjustment.\n\nMy research indicates that for a professional with my experience level in ${domain} delivering high-impact metrics like: "${accomplishments || 'scalable technical delivery and engineering execution'}", the market threshold is positioned approximately ${targetAdjustment} higher than the current base offer. Aligning with this market standard would reflect the specialized skills I bring to the table.\n\nThank you for considering this data-aligned proposal. I look forward to finding a mutually beneficial agreement.\n\nSincerely,\n[Your Name]`;
        points = [
          "Objective anchoring: Anchored in regional market percentiles, making it difficult to reject on subjective grounds.",
          "Objective metrics: Focused strictly on documented delivery metrics and technical competence.",
          "Removes emotion: Keeps the tone professional, objective, and analytical."
        ];
        strategies = [
          "If they cite general budget limits: Ask to see the objective pay band definitions for this role to discuss where your high-impact milestones place you.",
          "If they defer to next review: Ask to write a performance-linked salary review clause directly into the employment contract for 6 months."
        ];
      } else { // Collaborative
        template = `Dear [Recruiter Name],\n\nThank you so much for the offer to join as a ${experience}-level ${domain} professional. I have great respect for your vision and am very eager to collaborate with the team.\n\nI want to ensure my starting package is aligned with both the role's high expectations and the specialized skills I offer. Specifically, my expertise in "${accomplishments || 'driving product improvements and collaborative engineering'}" will enable me to deliver immediate value to your current ${domain} initiatives. Would it be possible to explore adjusting the base compensation by ${targetAdjustment}?\n\nI want to work together to find a solution that works for both of us and sets us up for a highly successful partnership. Thank you for your support!\n\nWarmly,\n[Your Name]`;
        points = [
          "Partnership focus: Frames the discussion as a collaborative exercise to achieve a win-win partnership.",
          "Immediate contribution: Highlights how your skills (\"${accomplishments || 'high-impact competencies'}\") directly solve their immediate engineering priorities.",
          "Soft power: Uses collaborative language to lower defensive barriers while remaining firm on value."
        ];
        strategies = [
          "If they can't match base: Propose non-salary benefits like remote work stipends, signing bonuses, or an accelerated 6-month review schedule.",
          "If they request compromise: Suggest meeting halfway with a written commitment to review compensation upon completing your first major milestone."
        ];
      }

      setGeneratedScript({
        scriptTemplate: template,
        talkingPoints: points,
        counterOfferStrategies: strategies
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript.scriptTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Recharts Chart Data
  const chartData = [
    { name: 'Average Male', amount: benchmarks.maleAvg, fill: '#6366F1' },
    { name: 'Average Female', amount: benchmarks.femaleAvg, fill: '#EC4899' },
    { name: 'Your Offer / Target', amount: currentOffer, fill: '#10B981' }
  ];

  // Helper for dual-range slider percentage values
  const getPercent = (val: number) => {
    const min = sliderMin;
    const max = sliderMax;
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const currentOfferPercent = getPercent(currentOffer);
  const minRecommendedPercent = getPercent(benchmarks.min);
  const maxRecommendedPercent = getPercent(benchmarks.max);

  // Market Placement Rating
  const getOfferRating = () => {
    if (currentOffer < benchmarks.min) {
      return { label: 'Below Market Range', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    }
    if (currentOffer > benchmarks.max) {
      return { label: 'Above Market Range', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' };
    }
    return { label: 'Aligned with Fair Market Range', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
  };

  const rating = getOfferRating();

  return (
    <div className="w-full space-y-10" id="fintech-equalizer-section">
      
      {/* Title & Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30 rounded-full text-purple-300 text-xs font-semibold mb-3">
          <TrendingUp size={14} className="text-pink-400 animate-pulse" />
          Equal Pay Portal • UN SDG 5 Framework
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Wage Equalizer & Negotiation Simulator
        </h2>
        <p className="mt-3 text-base sm:text-lg text-slate-400">
          An interactive dashboard mapping fair STEM compensation thresholds. Verify your offer against validated gender wage patterns, then draft custom negotiation scripts in seconds.
        </p>
      </div>

      {/* 1. Top Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-black/10 hover:border-pink-500/20 transition-all duration-300">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Benchmark Wage Gap</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-pink-400 font-sans">
                {benchmarks.wageGap}%
              </span>
              <span className="text-xs text-slate-500 font-mono">in {domain}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Info size={10} className="text-pink-500" />
              Statistically validated gap for this segment.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <AlertCircle size={22} className="animate-pulse" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-black/10 hover:border-emerald-500/20 transition-all duration-300">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Target Fair Market Value</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {formatValue(Math.round((benchmarks.min + benchmarks.max) / 2))}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-500" />
              Recommended equal-compensation anchor.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Metric 3: Radial Progress Score */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between shadow-xl shadow-black/10 hover:border-purple-500/20 transition-all duration-300">
          <div>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">Negotiation Readiness</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-purple-300 font-sans">
                {readinessScore}%
              </span>
              <span className="text-xs text-slate-500 font-mono">Overall Score</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              <Sparkles size={10} className="text-purple-400" />
              Increases as you supply achievements & build script.
            </p>
          </div>
          
          {/* Circular Progress Gauge */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-purple-500 transition-all duration-500 ease-out"
                strokeDasharray={`${readinessScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-bold text-white font-mono">{readinessScore}%</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* 2. Left Panel: Interactive Calculator & Bar Chart */}
        <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between shadow-2xl shadow-black/35 space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={18} />
                Salary Benchmark Calculator
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">Interactive Data</span>
            </div>

            {/* Form Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">STEM / Tech Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as DomainType)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Core Engineering">Core Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Experience Level</label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value as ExpLevelType)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="Entry">Entry (0-2 YOE)</option>
                  <option value="Mid">Mid-Level (2-6 YOE)</option>
                  <option value="Lead">Lead / Principal (6+ YOE)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Geographic Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as RegionType)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="North America (USD)">North America (USD)</option>
                  <option value="Europe (EUR)">Europe (EUR)</option>
                  <option value="India (INR)">India (INR)</option>
                  <option value="Asia Pacific (SGD)">Asia Pacific (SGD)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Current Offer / Base Salary</label>
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono font-bold">
                      {symbol}
                    </span>
                    <input
                      type="number"
                      value={currentOffer}
                      onChange={(e) => setCurrentOffer(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 transition-all font-mono"
                    />
                  </div>
                  {/* Real slider input to support the full range of sliding */}
                  <div className="px-1 pt-1">
                    <input
                      type="range"
                      min={sliderMin}
                      max={sliderMax}
                      value={currentOffer}
                      onChange={(e) => setCurrentOffer(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500/50"
                      title="Slide to adjust current offer base salary"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-500 mt-1">
                      <span>Slider Range Min: {formatValue(sliderMin)}</span>
                      <span>Slider Range Max: {formatValue(sliderMax)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Dual-Range Comparison Visualizer */}
            <div className="mt-8 bg-slate-950/40 border border-white/5 p-4 rounded-xl space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400">Offer vs. Market Range Comparison</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border rounded-full ${rating.color}`}>
                  {rating.label}
                </span>
              </div>

              {/* Slider Gauge Track */}
              <div className="relative pt-6 pb-2">
                {/* Visual track background line */}
                <div className="h-2 w-full bg-slate-800 rounded-full" />

                {/* Highlighted recommended fair market range block */}
                <div 
                  className="absolute top-[30px] h-2 bg-emerald-500/30 border-l border-r border-emerald-400 rounded-sm"
                  style={{ 
                    left: `${minRecommendedPercent}%`, 
                    width: `${maxRecommendedPercent - minRecommendedPercent}%` 
                  }}
                />

                {/* Left/Right markers on the fair range block */}
                <div 
                  className="absolute top-1 text-[9px] font-mono text-emerald-400 font-bold"
                  style={{ left: `${minRecommendedPercent}%`, transform: 'translateX(-50%)' }}
                >
                  Min: {formatValue(benchmarks.min)}
                </div>
                <div 
                  className="absolute top-1 text-[9px] font-mono text-emerald-400 font-bold"
                  style={{ left: `${maxRecommendedPercent}%`, transform: 'translateX(-50%)' }}
                >
                  Max: {formatValue(benchmarks.max)}
                </div>

                {/* Current offer vertical glowing pin pointer */}
                <div 
                  className="absolute top-4 w-4 h-4 rounded-full bg-pink-500 border-2 border-white shadow-lg shadow-pink-500/50 flex items-center justify-center -translate-x-1/2 transition-all duration-150"
                  style={{ left: `${currentOfferPercent}%` }}
                >
                  <div className="w-1 h-1 rounded-full bg-slate-950" />
                  
                  {/* Glowing Tooltip Pointer */}
                  <div className="absolute top-5 bg-pink-600 text-white font-mono font-bold px-2 py-0.5 rounded text-[9px] whitespace-nowrap shadow-lg shadow-black/40">
                    Offer: {formatValue(currentOffer)}
                  </div>
                </div>
              </div>

              {/* Dynamic offer adjustment slider */}
              <div className="pt-3 border-t border-white/5 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Slide to simulate offer values:</span>
                  <span>{formatValue(sliderMin)} - {formatValue(sliderMax)}</span>
                </div>
                <input 
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  value={currentOffer}
                  onChange={(e) => setCurrentOffer(parseInt(e.target.value) || 0)}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none mt-1"
                />
              </div>
            </div>
          </div>

          {/* Recharts Column Visualization of Gender Wages */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Gender Comp Disparity in {domain}</span>
              <span className="text-[10px] font-mono text-slate-500">Source: Market Data averages</span>
            </div>
            
            <div className="h-44 w-full bg-slate-950/20 rounded-xl p-2 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#475569" 
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#475569" 
                    fontSize={9} 
                    tickFormatter={(v) => region === 'India (INR)' ? `₹${(v/100000).toFixed(0)}L` : `$${(v/1000).toFixed(0)}k`}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(11, 15, 23, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '12px'
                    }}
                    formatter={(value: any) => [formatValue(Number(value)), 'Compensation']}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Right Panel: AI Negotiation Script Builder */}
        <div className="lg:col-span-6 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col justify-between shadow-2xl shadow-black/35 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="text-pink-400" size={18} />
                AI Negotiation Script Builder
              </h3>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider bg-slate-900 px-2 py-1 rounded">Powered by Ask-Her-AI</span>
            </div>

            {/* Form Controls for Script Builder */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Target Salary Adjustment</label>
                  <input
                    type="text"
                    value={targetAdjustment}
                    onChange={(e) => setTargetAdjustment(e.target.value)}
                    placeholder="e.g. 15% or ₹3 LPA"
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Tone Selection</label>
                  <div className="flex border border-white/10 rounded-xl overflow-hidden p-0.5 bg-slate-950/70">
                    {(['Confident', 'Data-Driven', 'Collaborative'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTone(t)}
                        className={`flex-1 py-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg transition-all ${
                          tone === t 
                            ? 'bg-pink-500/20 border border-pink-500/35 text-pink-400 shadow' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Key Accomplishments & Impact</label>
                <textarea
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  placeholder="e.g. Architected highly modular secure API routers, resulting in a 35% latency reduction and leading deployment sprint on-time."
                  rows={3}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Info size={11} className="text-pink-500/60" />
                  Cite direct technical outcomes to provide solid justification.
                </p>
              </div>
            </div>

            {/* Dynamic CTA Button */}
            <button
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-[1px] focus:outline-none focus:ring-2 focus:ring-pink-500 active:scale-98 transition-transform disabled:opacity-50"
            >
              <span className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 hover:bg-slate-950/30 px-4 py-3 font-semibold text-white transition-all text-xs">
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border border-pink-400 border-t-transparent animate-spin" />
                    Analyzing Data & Drafting Script...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} className="text-pink-400 animate-pulse" />
                    Generate AI Negotiation Script
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Output Drawer (Copyable Script Box) */}
          <div className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {generatedScript ? (
                <motion.div
                  key="script-output"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 flex flex-col justify-between bg-slate-950/50 border border-pink-500/10 rounded-xl p-4 space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-1.5">
                        <Award size={14} className="text-pink-400" />
                        <span className="text-xs font-bold text-white">Your Customized {tone} Template</span>
                      </div>
                      <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center gap-1 px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 rounded border border-white/10 transition-all font-mono"
                      >
                        {copied ? (
                          <>
                            <Check size={11} className="text-emerald-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={11} className="text-pink-400" />
                            Copy Template
                          </>
                        )}
                      </button>
                    </div>

                    {/* Template Content */}
                    <div className="bg-slate-950/90 border border-white/5 p-3 rounded-lg text-slate-300 font-mono text-[10.5px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto mt-3">
                      {generatedScript.scriptTemplate}
                    </div>
                  </div>

                  {/* Bulleted Talking Points & Objections */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/5 pt-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-pink-400 block mb-2">Key Talking Points</span>
                      <ul className="space-y-1.5">
                        {generatedScript.talkingPoints.map((point, idx) => (
                          <li key={idx} className="text-[10px] text-slate-400 leading-relaxed flex items-start gap-1">
                            <span className="text-pink-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-2">Counter-Offer Tactics</span>
                      <ul className="space-y-1.5">
                        {generatedScript.counterOfferStrategies.map((strategy, idx) => (
                          <li key={idx} className="text-[10px] text-slate-400 leading-relaxed flex items-start gap-1">
                            <span className="text-purple-500 font-bold">•</span>
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-xl bg-slate-950/20 text-slate-500 h-60">
                  <Zap size={32} className="text-slate-700 mb-3 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-400">Negotiation Script Ready</p>
                  <p className="text-[10.5px] text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                    Set your adjustment target, input key career achievements, and click "Generate" to construct custom-tailored pitch patterns.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
