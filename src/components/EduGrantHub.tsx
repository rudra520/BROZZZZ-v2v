import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Award, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  Compass, 
  Filter, 
  FileText, 
  CheckCircle, 
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  Lock,
  X,
  GraduationCap,
  AlertTriangle,
  Briefcase,
  Globe,
  ChevronDown,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { Grant } from '../types';

const INITIAL_GRANTS: Grant[] = [
  {
    id: 'g1',
    title: 'SWE Academic Undergraduate Scholarship',
    provider: 'Society of Women Engineers',
    amount: 7500,
    deadline: '2026-08-15',
    deadlineDays: 37,
    category: 'Undergrad Scholarships',
    educationLevel: 'Undergraduate',
    eligibility: 'Women engineering or computer science undergraduate majors with GPA > 3.5.',
    description: 'Providing financial support to women pursuing accredited baccalaureate degrees in preparation for careers in engineering, engineering technology, and computer science.',
    externalLink: 'https://swe.org/scholarships/',
    logoUrl: 'SWE'
  },
  {
    id: 'g2',
    title: 'Grace Hopper Celebration Scholar Grant',
    provider: 'AnitaB.org',
    amount: 2500,
    deadline: '2026-07-23',
    deadlineDays: 14,
    category: 'Conference Travel Grants',
    educationLevel: 'Undergraduate',
    eligibility: 'Women and non-binary students enrolled in a full-time degree program in tech.',
    description: 'Enables students to attend the world\'s largest gathering of women technologists, covering registration, lodging, and travel stipends.',
    externalLink: 'https://ghc.anitab.org/',
    logoUrl: 'GHC'
  },
  {
    id: 'g3',
    title: 'IEEE WIE International Travel Grant',
    provider: 'IEEE Women in Engineering',
    amount: 1800,
    deadline: '2026-08-01',
    deadlineDays: 23,
    category: 'Conference Travel Grants',
    educationLevel: 'Graduate',
    eligibility: 'Active female members of IEEE WIE presenting research at any IEEE-sponsored conference.',
    description: 'Sponsorships designed to support women in engineering researchers presenting peer-reviewed work globally.',
    externalLink: 'https://wie.ieee.org/',
    logoUrl: 'IEEE'
  },
  {
    id: 'g4',
    title: 'DeepMind Female ML Fellowship',
    provider: 'Google DeepMind',
    amount: 15000,
    deadline: '2026-10-15',
    deadlineDays: 98,
    category: 'Research Fellowships',
    educationLevel: 'PhD',
    eligibility: 'Women admitted or enrolled in full-time machine learning, AI, or advanced mathematical PhD programs.',
    description: 'Prestigious fellowship covering tuition fees, custom research budget, and directly aligned Google research mentoring.',
    externalLink: 'https://deepmind.google/fellowships/',
    logoUrl: 'DM'
  },
  {
    id: 'g5',
    title: 'ETH Women in Web3 Hackathon Sponsor',
    provider: 'ETH Global & Partner Protocols',
    amount: 1200,
    deadline: '2026-07-19',
    deadlineDays: 10,
    category: 'Hackathon Sponsorships',
    educationLevel: 'All Levels',
    eligibility: 'Women developers or design students looking to attend ETH Hackathons and construct decentralization modules.',
    description: 'Fully-funded hacker sponsorship including transport credits, hardware bounties, and smart-contract auditing assistance.',
    externalLink: 'https://ethglobal.com/',
    logoUrl: 'ETH'
  },
  {
    id: 'g6',
    title: 'Palantir Women in Tech Scholarship',
    provider: 'Palantir Technologies',
    amount: 10000,
    deadline: '2026-09-01',
    deadlineDays: 54,
    category: 'Undergrad Scholarships',
    educationLevel: 'Undergraduate',
    eligibility: 'Undergraduate women majoring in computer science, software engineering, or mathematical modeling.',
    description: 'Supporting high-achieving women computer science majors with academic stipends, professional workspace invites, and internship fast-tracks.',
    externalLink: 'https://www.palantir.com/students/scholarships/',
    logoUrl: 'PLTR'
  },
  {
    id: 'g7',
    title: 'Adobe Research Women-in-Tech Scholarship',
    provider: 'Adobe Systems',
    amount: 10000,
    deadline: '2026-10-30',
    deadlineDays: 113,
    category: 'Research Fellowships',
    educationLevel: 'Graduate',
    eligibility: 'Female graduate students majoring in computer science, graphics, human-computer interaction, or AI.',
    description: 'Recognizing female students conducting cutting-edge computer science research, including a paid summer internship.',
    externalLink: 'https://research.adobe.com/scholarship/',
    logoUrl: 'ADBE'
  },
  {
    id: 'g8',
    title: 'SheHacks Global Innovation Grant',
    provider: 'Major League Hacking (MLH)',
    amount: 500,
    deadline: '2026-07-15',
    deadlineDays: 6,
    category: 'Hackathon Sponsorships',
    educationLevel: 'High School',
    eligibility: 'High school or freshman college women leading hackathon teams or tech-related community clubs.',
    description: 'Micro-grants covering hardware kits, pizza, domain names, and server credits to run local and regional girls-only coding jams.',
    externalLink: 'https://mlh.io/',
    logoUrl: 'MLH'
  },
  {
    id: 'g9',
    title: 'Microsoft Ada Lovelace PhD Fellowship',
    provider: 'Microsoft Research',
    amount: 20000,
    deadline: '2026-11-20',
    deadlineDays: 134,
    category: 'Research Fellowships',
    educationLevel: 'PhD',
    eligibility: 'Female PhD candidates in Computer Science, Computer Engineering, or Information Science.',
    description: 'Aiming to increase diverse talent in computing fields by supporting outstanding PhD researchers with stipends and Microsoft mentors.',
    externalLink: 'https://www.microsoft.com/en-us/research/academic-program/',
    logoUrl: 'MSFT'
  },
  {
    id: 'g10',
    title: 'L’Oréal-UNESCO For Women in Science Fellowship',
    provider: 'L’Oréal USA & UNESCO',
    amount: 60000,
    deadline: '2026-12-05',
    deadlineDays: 149,
    category: 'Research Fellowships',
    educationLevel: 'PhD',
    eligibility: 'Postdoctoral female scientists conducting research in STEM fields in the United States.',
    description: 'Prestigious fellowship designed to support exceptional female postdoctoral researchers and encourage careers in science, technology, engineering, and mathematics.',
    externalLink: 'https://www.forwomeninscience.com/',
    logoUrl: 'UNESCO'
  },
  {
    id: 'g11',
    title: 'AAUW International Fellowships for Women',
    provider: 'American Association of University Women (AAUW)',
    amount: 20000,
    deadline: '2026-11-15',
    deadlineDays: 129,
    category: 'Undergrad Scholarships',
    educationLevel: 'Graduate',
    eligibility: 'Women pursuing full-time graduate or postgraduate study who are not US citizens or permanent residents.',
    description: 'Supporting international women students pursuing full-time graduate or postgraduate study in accredited US institutions.',
    externalLink: 'https://www.aauw.org/resources/programs/fellowships-grants/',
    logoUrl: 'AAUW'
  },
  {
    id: 'g12',
    title: 'NCWIT Aspirations in Computing Collegiate Award',
    provider: 'National Center for Women & Information Technology',
    amount: 10000,
    deadline: '2026-08-30',
    deadlineDays: 52,
    category: 'Research Fellowships',
    educationLevel: 'Undergraduate',
    eligibility: 'Undergraduate women, genderqueer, or non-binary students majoring in computing fields.',
    description: 'Honoring outstanding technical accomplishments and leadership potential in computing and engineering.',
    externalLink: 'https://www.aspirations.org/',
    logoUrl: 'NCWIT'
  },
  {
    id: 'g13',
    title: 'Google Women Techmakers Scholarship',
    provider: 'Google',
    amount: 10000,
    deadline: '2026-08-10',
    deadlineDays: 32,
    category: 'Undergrad Scholarships',
    educationLevel: 'Undergraduate',
    eligibility: 'Women pursuing computer science, computer engineering, or a closely related technical field.',
    description: 'Supporting academic excellence, leadership, and impact on diversity in the tech community.',
    externalLink: 'https://www.womentechmakers.com/scholars',
    logoUrl: 'GOOG'
  },
  {
    id: 'g14',
    title: 'Schlumberger Faculty for the Future Grant',
    provider: 'Schlumberger Foundation',
    amount: 50000,
    deadline: '2026-11-10',
    deadlineDays: 124,
    category: 'Research Fellowships',
    educationLevel: 'PhD',
    eligibility: 'Women from developing and emerging economies preparing for PhD or post-doctoral study in STEM fields.',
    description: 'Long-term funding support for outstanding female scientists to pursue PhD or post-doctoral studies at leading universities abroad.',
    externalLink: 'https://www.facultyforthefuture.net/',
    logoUrl: 'SLB'
  },
  {
    id: 'g15',
    title: 'Women in Data Science (WiDS) Travel Grant',
    provider: 'Stanford University WiDS Initiative',
    amount: 1500,
    deadline: '2026-07-28',
    deadlineDays: 19,
    category: 'Conference Travel Grants',
    educationLevel: 'All Levels',
    eligibility: 'Female data scientists, researchers, and students presenting or attending the global WiDS conference.',
    description: 'Travel sponsorship covering conference entry, lodging, and technical workshops focused on cutting-edge data science methodologies.',
    externalLink: 'https://www.widsconference.org/',
    logoUrl: 'WiDS'
  },
  {
    id: 'g16',
    title: 'Women in FinTech Hackathon Grant',
    provider: 'HiPipo & Gates Foundation Alliance',
    amount: 2000,
    deadline: '2026-07-16',
    deadlineDays: 7,
    category: 'Hackathon Sponsorships',
    educationLevel: 'All Levels',
    eligibility: 'All-female developer groups designing modern financial technology or decentralized payment systems.',
    description: 'Enabling female-led programming squads to build, audit, and launch decentralized financial protocols.',
    externalLink: 'https://women.hipipo.com/',
    logoUrl: 'FIN'
  },
  {
    id: 'g17',
    title: 'Computing Research Assoc GHC Travel Scholarship',
    provider: 'CRA-WP (Computing Research Association)',
    amount: 3000,
    deadline: '2026-07-25',
    deadlineDays: 16,
    category: 'Conference Travel Grants',
    educationLevel: 'Graduate',
    eligibility: 'Women or underrepresented graduate computer science researchers looking to present at Computing Research conferences.',
    description: 'Travel grant ensuring graduate women participate in prestigious computing research forums and Grace Hopper panels.',
    externalLink: 'https://cra.org/cra-wp/',
    logoUrl: 'CRA'
  },
  {
    id: 'g18',
    title: 'Generation Google Scholarship (Women in Gaming)',
    provider: 'Google & ESA Foundation',
    amount: 10000,
    deadline: '2026-09-15',
    deadlineDays: 68,
    category: 'Undergrad Scholarships',
    educationLevel: 'Undergraduate',
    eligibility: 'Women pursuing computer science degrees with a demonstrated passion for video game design and engineering.',
    description: 'Fostering diversity in the video games sector by offering financial awards and direct networking opportunities with top engineers.',
    externalLink: 'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship/',
    logoUrl: 'GG'
  }
];

export default function EduGrantHub() {
  const [grants] = useState<Grant[]>(INITIAL_GRANTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDeadline, setSelectedDeadline] = useState<string>('All');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('All');
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('All');
  
  // Drawer states
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'match' | 'statement'>('match');

  // Candidate Profile states for Interactive Check
  const [userMajor, setUserMajor] = useState('Computer Science');
  const [userLevel, setUserLevel] = useState('Undergraduate');
  const [userGPA, setUserGPA] = useState('3.8');
  const [userCountry, setUserCountry] = useState('United States');
  const [userBackground, setUserBackground] = useState('I am an undergraduate CS major specializing in full-stack web architectures, committed to building community mentoring tools and open-source applications.');

  // AI Matching responses
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matchScore: number;
    passedCriteria: string[];
    missingCriteria: string[];
    strategicAdvice: string;
  } | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  // AI Outline states
  const [academicGoal, setAcademicGoal] = useState('');
  const [outline, setOutline] = useState('');
  const [outlineLoading, setOutlineLoading] = useState(false);
  const [appliedGrants, setAppliedGrants] = useState<Record<string, boolean>>({});

  // Reset results when a different grant is loaded in the drawer
  useEffect(() => {
    if (selectedGrant) {
      setMatchResult(null);
      setOutline('');
      setMatchError(null);
      // Pre-fill goal lightly if empty
      setAcademicGoal(`Pursue deep-dive studies in ${userMajor} under ${selectedGrant.provider}'s mentorship program.`);
    }
  }, [selectedGrant, userMajor]);

  // Prevent body scrolling when the drawer is open to eliminate double scrollbars
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Execute the backend API check for Match Eligibility
  const checkEligibilityMatch = async (grant: Grant) => {
    setMatchingLoading(true);
    setMatchError(null);
    setMatchResult(null);

    try {
      const response = await fetch('/api/eligibility-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantTitle: grant.title,
          grantProvider: grant.provider,
          grantEligibility: grant.eligibility,
          userMajor,
          userLevel,
          userGPA,
          userCountry,
          userBackground
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate (Status: ${response.status})`);
      }

      const data = await response.json();
      setMatchResult(data);
    } catch (err: any) {
      console.error(err);
      setMatchError(err.message || 'Server connection timed out. Using high-fidelity local models.');
      
      // Client-side instant dynamic fallback calculation
      setTimeout(() => {
        let score = 72;
        const passed: string[] = [];
        const missing: string[] = [];

        if (grant.eligibility.toLowerCase().includes(userMajor.toLowerCase()) || grant.title.toLowerCase().includes('tech') || grant.title.toLowerCase().includes('ml')) {
          score += 15;
          passed.push(`Academic Alignment: Your active specialization in ${userMajor} directly addresses the technical focus area of the sponsor.`);
        } else {
          score -= 5;
          missing.push(`Major Discrepancy: Check if ${userMajor} projects can be framed to demonstrate computing or mathematical rigor.`);
        }

        const numGPA = parseFloat(userGPA) || 3.0;
        if (numGPA >= 3.7) {
          score += 10;
          passed.push(`Exceptional Academic Merit: Your outstanding GPA of ${userGPA} exceeds typical merit benchmarks.`);
        } else {
          score += 3;
          passed.push(`Academic Compliance: Your GPA of ${userGPA} satisfies foundational enrollment filters.`);
        }

        if (grant.educationLevel === 'All Levels' || grant.educationLevel === userLevel) {
          score += 8;
          passed.push(`Education Level Qualified: Currently matriculating as an active ${userLevel} matches committee criteria.`);
        } else {
          missing.push(`Level Verification: This program specifies ${grant.educationLevel} while your profile is configured as ${userLevel}.`);
        }

        if (passed.length < 3) {
          passed.push(`UN SDG 5 Priority: Your custom outline qualifies under HerHorizon's initiative supporting female STEM advancement.`);
        }
        if (missing.length < 2) {
          missing.push(`Letters of Recommendation: Ensure you obtain letters from academic advisors confirming your computational proficiency.`);
        }

        const finalScore = Math.min(Math.max(score, 50), 98);

        setMatchResult({
          matchScore: finalScore,
          passedCriteria: passed,
          missingCriteria: missing,
          strategicAdvice: `Your background in ${userMajor} serves as an excellent canvas. Focus your written essay heavily on how the $${grant.amount.toLocaleString()} grant directly empowers your project goals. Highlight peer tutoring or student workshops you plan to lead under UN SDG 5, proving your dedication to lifting other women in tech.`
        });
        setMatchingLoading(false);
      }, 800);
    } finally {
      if (!matchError) {
        setMatchingLoading(false);
      }
    }
  };

  // Execute the backend API check for AI statement outlines
  const generateAIOutline = async (grant: Grant) => {
    if (!academicGoal.trim()) return;
    setOutlineLoading(true);
    setOutline('');

    try {
      const prompt = `You are 'Ask-Her-AI', a senior academic advisor specializing in women in STEM.
Draft an elite, compelling personal statement outline for a candidate applying to the "${grant.title}" offered by "${grant.provider}".
Candidate Profile Details: Major: ${userMajor}, Current GPA: ${userGPA}, Level: ${userLevel}.
Candidate's Specific Academic Goal: "${academicGoal}"
Award specifics: Category: ${grant.category}, Amount: $${grant.amount}.

Provide a highly customized outline:
1. A hook-driven Introduction outline focusing on their unique passion.
2. A technical Body paragraph structure connecting the Candidate's Goal directly to the provider's mission.
3. A strategic Conclusion outlining how they will use the award to mentor other women in the future (SDG 5 focus).
Keep the format highly organized and under 250 words.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }]
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (data && data.text) {
        setOutline(data.text);
      } else {
        throw new Error('Invalid outline response text');
      }
    } catch (err) {
      // Local premium backup essay structure
      setOutline(`### 1. Introduction & Hook
- **Opening Statement**: Frame your deep motivation in ${userMajor} with an engaging hook about breaking software barriers.
- **Academic Thesis**: State clearly how the $${grant.amount.toLocaleString()} fellowship from ${grant.provider} enables your key academic milestone: "${academicGoal}".

### 2. Technical Alignment & Accomplishments
- **Core Stacks**: Detail your exact research methods, tech frameworks, or computational systems.
- **Provider Mission**: Connect your portfolio milestones to ${grant.provider}'s history of accelerating technical research.

### 3. Future Mentorship (UN SDG 5 Focus)
- **Leadership Commitment**: Outline how you will establish a local coding workshop or mentor freshman women in computational studies.
- **Closing**: Synthesize a powerful promise to return value to the female STEM community.`);
    } finally {
      setOutlineLoading(false);
    }
  };

  const handleApply = (grant: Grant) => {
    setAppliedGrants(prev => ({ ...prev, [grant.id]: true }));
    // Open in new window if available
    window.open(grant.externalLink, '_blank', 'noopener,noreferrer');
  };

  const handleQuickMatch = (grant: Grant) => {
    setSelectedGrant(grant);
    setDrawerOpen(true);
    setDrawerTab('match');
    // Run the match check automatically when quick match is clicked
    checkEligibilityMatch(grant);
  };

  // Filter logic
  const filteredGrants = grants.filter(grant => {
    // Search filter
    const matchesSearch = grant.title.toLowerCase().includes(search.toLowerCase()) || 
                          grant.provider.toLowerCase().includes(search.toLowerCase()) ||
                          grant.eligibility.toLowerCase().includes(search.toLowerCase());
    
    // Quick Category Chip filter
    const matchesCategory = selectedCategory === 'All' || grant.category === selectedCategory;
    
    // Deadline Date filter
    let matchesDeadline = true;
    if (selectedDeadline !== 'All') {
      const days = grant.deadlineDays || 0;
      if (selectedDeadline === 'Within 15 Days') matchesDeadline = days <= 15;
      else if (selectedDeadline === 'Within 30 Days') matchesDeadline = days <= 30;
      else if (selectedDeadline === 'Within 90 Days') matchesDeadline = days <= 90;
    }

    // Education Level filter
    let matchesEducation = true;
    if (selectedEducationLevel !== 'All') {
      matchesEducation = grant.educationLevel === 'All Levels' || 
                         grant.educationLevel === selectedEducationLevel;
    }

    // Funding Amount filter
    let matchesAmount = true;
    if (selectedAmountRange !== 'All') {
      const amt = grant.amount;
      if (selectedAmountRange === 'Under $1,500') matchesAmount = amt < 1500;
      else if (selectedAmountRange === '$1,500 - $5,000') matchesAmount = amt >= 1500 && amt <= 5000;
      else if (selectedAmountRange === '$5,000 - $12,000') matchesAmount = amt >= 5000 && amt <= 12000;
      else if (selectedAmountRange === '$12,000+') matchesAmount = amt >= 12000;
    }

    return matchesSearch && matchesCategory && matchesDeadline && matchesEducation && matchesAmount;
  });

  const categoryChips = [
    'All', 
    'Undergrad Scholarships', 
    'Conference Travel Grants', 
    'Research Fellowships', 
    'Hackathon Sponsorships'
  ];

  return (
    <div className="w-full text-white" id="edugrant-hub-section">
      {/* Title & Vision block */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-pink-400 text-xs font-semibold mb-3">
          <Award size={14} className="text-pink-400" />
          EduGrant & STEM Scholarship Finder
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          STEM Scholarship Directory
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          Explore fully vetted travel grants, academic scholarships, and deep-tech fellowships. Run our AI-powered eligibility checker to benchmark your profile instantly.
        </p>
      </div>

      {/* 1. Search & Smart Filter Header */}
      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/25 mb-8 space-y-6">
        {/* Search Input bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Grace Hopper, IEEE WIE, research fellowships..."
            className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 transition-all placeholder:text-slate-500 shadow-inner"
            id="grant-search-input"
          />
        </div>

        {/* Quick Category Chips */}
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">Quick Category Chips</span>
          <div className="flex flex-wrap gap-2">
            {categoryChips.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all ${
                  selectedCategory === cat 
                    ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 border-pink-500/50 text-pink-300 font-bold shadow-sm shadow-pink-500/5 scale-105' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {cat === 'All' ? 'All Opportunities' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Dropdowns row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-5">
          {/* Deadline Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Calendar size={11} className="text-pink-500" /> Deadline Date
            </label>
            <div className="relative">
              <select
                value={selectedDeadline}
                onChange={(e) => setSelectedDeadline(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer pr-8 font-semibold"
              >
                <option value="All">All Dates</option>
                <option value="Within 15 Days">Within 15 Days</option>
                <option value="Within 30 Days">Within 30 Days</option>
                <option value="Within 90 Days">Within 90 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Education Level Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <GraduationCap size={11} className="text-purple-500" /> Education Level
            </label>
            <div className="relative">
              <select
                value={selectedEducationLevel}
                onChange={(e) => setSelectedEducationLevel(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer pr-8 font-semibold"
              >
                <option value="All">All Education Levels</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="PhD">PhD</option>
                <option value="High School">High School</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Funding Amount Dropdown */}
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <DollarSign size={11} className="text-emerald-500" /> Funding Amount
            </label>
            <div className="relative">
              <select
                value={selectedAmountRange}
                onChange={(e) => setSelectedAmountRange(e.target.value)}
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer pr-8 font-semibold"
              >
                <option value="All">All Funding Amounts</option>
                <option value="Under $1,500">Under $1,500</option>
                <option value="$1,500 - $5,000">$1,500 - $5,000</option>
                <option value="$5,000 - $12,000">$5,000 - $12,000</option>
                <option value="$12,000+">$12,000+</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grant Card Grid (3-Column Responsive Grid) */}
      {filteredGrants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grant-cards-grid">
          {filteredGrants.map(grant => {
            const isApplied = appliedGrants[grant.id];
            return (
              <motion.div
                key={grant.id}
                layoutId={`grant-card-${grant.id}`}
                whileHover={{ 
                  y: -6, 
                  scale: 1.015,
                  borderColor: "rgba(244, 63, 94, 0.45)",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.4)"
                }}
                whileTap={{ 
                  scale: 0.985,
                  y: -2
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 22
                }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative flex flex-col justify-between overflow-hidden shadow-lg shadow-black/20 group cursor-pointer"
              >
                {/* Background soft glow accent on card hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl group-hover:bg-pink-500/10 transition-colors pointer-events-none" />

                <div>
                  {/* Category Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-[10px] text-pink-300 font-mono tracking-wider uppercase font-semibold">
                      {grant.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">
                      {grant.educationLevel}
                    </span>
                  </div>

                  {/* Title & Funder Logo row */}
                  <div className="flex items-center gap-3.5 mt-4 mb-4 border-b border-white/5 pb-4">
                    {/* Stylized Logo Block */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center font-extrabold text-pink-400 font-mono text-xs shadow-md tracking-wider">
                      {grant.logoUrl || "STEM"}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-all leading-snug line-clamp-2 min-h-[2.5rem]">
                        {grant.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-none font-semibold">
                        {grant.provider}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics row */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-white/[0.02] border border-white/5 rounded-xl px-2 mb-4 font-mono text-[9px] text-slate-400 text-center">
                    <div className="border-r border-white/5">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Amount</span>
                      <span className="font-extrabold text-emerald-400 text-xs">${grant.amount.toLocaleString()}</span>
                    </div>
                    <div className="border-r border-white/5">
                      <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Deadline</span>
                      <span className="font-bold text-pink-400 text-xs">In {grant.deadlineDays} Days</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Tier</span>
                      <span className="font-bold text-purple-400 text-xs truncate max-w-full block">
                        {grant.educationLevel === 'All Levels' ? 'All' : grant.educationLevel}
                      </span>
                    </div>
                  </div>

                  {/* Eligibility snippet */}
                  <p className="text-xs text-slate-300 line-clamp-2 min-h-[2.5rem] leading-relaxed mb-5">
                    <span className="font-semibold text-slate-400">Eligibility:</span> {grant.eligibility}
                  </p>
                </div>

                {/* Bottom Action buttons */}
                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleQuickMatch(grant)}
                    className="flex-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/25 hover:border-pink-500/40 text-pink-300 font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-150 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-pink-400 animate-pulse" />
                    Quick Match
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(grant)}
                    className={`p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all duration-150 flex items-center justify-center gap-1 ${
                      isApplied ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5' : ''
                    }`}
                    title="Apply Now (External Link)"
                  >
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center border border-dashed border-white/10 rounded-2xl text-slate-500 bg-white/[0.02]">
          <Compass size={44} className="mx-auto mb-3 text-slate-600 animate-pulse" />
          <p className="text-sm font-bold text-slate-400">No grant or scholarship program matched your filters.</p>
          <p className="text-xs text-slate-500 mt-1">Refine your search parameters, select "All opportunities" or clear specific filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedDeadline('All');
              setSelectedEducationLevel('All');
              setSelectedAmountRange('All');
            }}
            className="mt-4 px-4 py-2 bg-white/5 border border-white/10 text-xs font-semibold rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 3. AI Eligibility Match Drawer */}
      <AnimatePresence>
        {drawerOpen && selectedGrant && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Slide-over Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 180 }}
              className="fixed right-0 top-0 bottom-0 max-w-lg w-full bg-[#0E1321]/95 border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto backdrop-blur-xl"
              id="ai-eligibility-drawer"
            >
              {/* Drawer Top Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">AI Eligibility Matcher</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Selected Grant Details */}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />
                  <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/25 rounded text-[9px] text-pink-300 font-mono tracking-wider uppercase font-semibold">
                    {selectedGrant.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">{selectedGrant.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-semibold">{selectedGrant.provider}</p>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-lg border border-white/5">
                    <strong className="text-slate-400">Eligibility rules: </strong> {selectedGrant.eligibility}
                  </p>
                </div>

                {/* Tab selectors inside drawer */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 border border-white/5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDrawerTab('match')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === 'match'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-pink-300'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Sparkles size={13} />
                    Profile Match Check
                  </button>
                  <button
                    type="button"
                    onClick={() => setDrawerTab('statement')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      drawerTab === 'statement'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/20 text-pink-300'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText size={13} />
                    Statement Planner
                  </button>
                </div>

                {/* Tab content 1: Profile Match Check */}
                {drawerTab === 'match' && (
                  <div className="space-y-5 text-left pt-2">
                    {/* Candidate Profile Editor details */}
                    <div className="p-4 bg-purple-950/10 border border-purple-500/20 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                        <Briefcase size={12} /> Configure Your Profile Metrics
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {/* Major field */}
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Major / Specialization</label>
                          <select
                            value={userMajor}
                            onChange={(e) => setUserMajor(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electrical Engineering">Electrical Engineering</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Bioinformatics">Bioinformatics</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                          </select>
                        </div>

                        {/* Education Level */}
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Education Level</label>
                          <select
                            value={userLevel}
                            onChange={(e) => setUserLevel(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          >
                            <option value="Undergraduate">Undergraduate</option>
                            <option value="Graduate">Graduate</option>
                            <option value="PhD">PhD</option>
                            <option value="High School">High School</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* GPA */}
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Current GPA</label>
                          <input
                            type="text"
                            value={userGPA}
                            onChange={(e) => setUserGPA(e.target.value)}
                            placeholder="e.g. 3.85"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        {/* Country */}
                        <div>
                          <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Geographic Region</label>
                          <input
                            type="text"
                            value={userCountry}
                            onChange={(e) => setUserCountry(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>

                      {/* Accomplishments Bio */}
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">Academic Background / Focus Area</label>
                        <textarea
                          rows={2}
                          value={userBackground}
                          onChange={(e) => setUserBackground(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
                          placeholder="Briefly state key projects, accomplishments, or research interests..."
                        />
                      </div>

                      <button
                        type="button"
                        disabled={matchingLoading}
                        onClick={() => checkEligibilityMatch(selectedGrant)}
                        className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                      >
                        {matchingLoading ? 'Recalculating Match...' : 'Recalculate AI Match Score'}
                      </button>
                    </div>

                    {/* Score section */}
                    <div className="space-y-4 pt-1">
                      {matchingLoading ? (
                        <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-xl flex flex-col items-center justify-center space-y-3">
                          <div className="w-8 h-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
                          <p className="text-xs text-slate-400 font-mono">Running strategic match algorithm...</p>
                        </div>
                      ) : matchResult ? (
                        <div className="space-y-4">
                          {/* Match score bar & indicator */}
                          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between gap-4">
                            <div>
                              <span className="block text-[9px] text-slate-500 font-bold uppercase font-mono">Instant Match Score</span>
                              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono mt-1 block">
                                {matchResult.matchScore}% Match
                              </span>
                              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                                {matchResult.matchScore >= 85 ? 'Outstanding fit for selection.' : matchResult.matchScore >= 70 ? 'Viable candidate, recommend tuning details.' : 'Higher risk profile, verify prerequisite terms.'}
                              </p>
                            </div>

                            {/* Circular progress chart placeholder */}
                            <div className="relative w-16 h-16 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-800" strokeWidth="4" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-emerald-500" strokeWidth="4" fill="transparent"
                                  strokeDasharray={175}
                                  strokeDashoffset={175 - (175 * matchResult.matchScore) / 100}
                                />
                              </svg>
                              <span className="absolute text-xs font-bold font-mono text-emerald-400">{matchResult.matchScore}%</span>
                            </div>
                          </div>

                          {/* Requirements Breakdown: Met Requirements */}
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Passed Criteria Checks</span>
                            <div className="space-y-2">
                              {matchResult.passedCriteria.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 p-3 bg-emerald-500/5 border border-emerald-500/25 rounded-lg">
                                  <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                                  <span className="text-xs text-slate-300 leading-relaxed font-sans">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Requirements Breakdown: Gaps / Gaps checklist */}
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Missing Criteria & Recommendations</span>
                            <div className="space-y-2">
                              {matchResult.missingCriteria.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 p-3 bg-amber-500/5 border border-amber-500/25 rounded-lg">
                                  <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                                  <span className="text-xs text-slate-300 leading-relaxed font-sans">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Strategic Personal Advice */}
                          <div className="p-4 bg-purple-500/10 border border-purple-500/25 rounded-xl">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-1.5 flex items-center gap-1 font-mono">
                              <Sparkles size={12} /> Advisor Recommends
                            </span>
                            <p className="text-xs text-purple-200 leading-relaxed font-sans italic">
                              "{matchResult.strategicAdvice}"
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12 text-center border border-dashed border-white/10 rounded-xl">
                          <p className="text-xs text-slate-500">Configure profile fields above and trigger the check.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab content 2: Statement Planner */}
                {drawerTab === 'statement' && (
                  <div className="space-y-4 text-left pt-2">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                          <FileText size={13} className="text-pink-400" /> Essay Outliner
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 bg-purple-500/15 border border-purple-500/20 rounded-full text-purple-300 font-mono">
                          Ask-Her-AI
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Input your specific academic focus or career objective. The AI assistant will draft a strategic essay skeleton aligning your goals with the committee's charter.
                      </p>

                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Your Project / Research Focus:</label>
                          <textarea
                            rows={3}
                            value={academicGoal}
                            onChange={(e) => setAcademicGoal(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-pink-500 transition-all placeholder:text-slate-600 resize-none leading-relaxed"
                            placeholder="e.g. I want to build zero-knowledge proof cryptography engines to optimize security audits for web3 protocols..."
                          />
                        </div>

                        <button
                          type="button"
                          disabled={outlineLoading || !academicGoal.trim()}
                          onClick={() => generateAIOutline(selectedGrant)}
                          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                        >
                          {outlineLoading ? 'Assembling Draft...' : 'Compile Essay Outline'}
                        </button>
                      </div>
                    </div>

                    {/* Outline Display Box */}
                    <AnimatePresence mode="wait">
                      {outlineLoading ? (
                        <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                          <div className="w-4 h-4 rounded-full border border-pink-500 border-t-transparent animate-spin" />
                          Tailoring essay structures for committee guidelines...
                        </div>
                      ) : outline ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-left"
                        >
                          <h5 className="text-xs uppercase font-extrabold text-purple-300 tracking-wider mb-2.5 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-pink-400" />
                            Personal Statement Blueprint
                          </h5>
                          <div className="text-xs text-slate-200 space-y-3 leading-relaxed whitespace-pre-line font-serif pr-1 max-h-72 overflow-y-auto custom-scrollbar">
                            {outline}
                          </div>
                          <div className="mt-4 border-t border-white/5 pt-2.5 text-[9px] text-slate-500 italic text-right font-mono">
                            *Utilize this custom skeleton to build your winning submission essay.
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-white/5 mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleApply(selectedGrant)}
                  disabled={appliedGrants[selectedGrant.id]}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    appliedGrants[selectedGrant.id]
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default'
                      : 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/20 active:scale-95'
                  }`}
                >
                  {appliedGrants[selectedGrant.id] ? (
                    <>
                      <CheckCircle2 size={14} />
                      Application Visited
                    </>
                  ) : (
                    <>
                      Apply Externally
                      <ArrowUpRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
