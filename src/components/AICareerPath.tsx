import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  Calendar, 
  Terminal, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Compass, 
  Code, 
  Award, 
  ArrowRight, 
  BookOpen, 
  RotateCcw,
  BookOpenCheck,
  Briefcase,
  Layers,
  ChevronDown,
  Check
} from 'lucide-react';

interface LinkItem {
  label: string;
  url: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

interface RoadmapNode {
  id: string;
  month: number;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  status: 'Completed' | 'In Progress' | 'Up Next';
  links: LinkItem[];
  checklist: ChecklistItem[];
}

const CURRENT_ROLE_OPTIONS = [
  "1st Year B.Tech Student",
  "Sophomore CS Student",
  "Self-Taught Coder",
  "Non-CS STEM Graduate",
  "Junior Front-End Dev"
];

const TARGET_ROLE_OPTIONS = [
  "AI Engineering Lead",
  "Machine Learning Researcher",
  "Computer Vision Specialist",
  "Quantitative ML Developer",
  "Full-Stack AI Architect"
];

const INITIAL_NODES: RoadmapNode[] = [
  // Month 1
  {
    id: "node-1",
    month: 1,
    title: "Python Programming & Foundational Mathematics",
    description: "Master advanced Python semantics, Object-Oriented Programming (OOP) principles, and critical mathematical domains like linear algebra and multi-variable calculus required for modeling deep neural systems.",
    skills: ["Python OOP", "Linear Algebra", "NumPy & Pandas", "Calculus Core"],
    duration: "2 Weeks",
    status: "Completed",
    links: [
      { label: "Python Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "NumPy Documentation", url: "https://numpy.org/doc/" }
    ],
    checklist: [
      { id: "chk-1-1", label: "Master dict comprehensions, lambdas, and generator expressions", done: true },
      { id: "chk-1-2", label: "Review matrix multiplication, eigenvalues, and gradients for neural nets", done: true },
      { id: "chk-1-3", label: "Write a raw NumPy backpropagation routine", done: true }
    ]
  },
  {
    id: "node-2",
    month: 1,
    title: "Data Structures & Algorithmic Complexity",
    description: "Build robust problem-solving patterns. Understand how hash maps, trees, and searching operations affect execution latency and memory constraints in scale.",
    skills: ["Trees & Graphs", "Hash Maps", "Searching & Sorting", "Big O Notation"],
    duration: "3 Weeks",
    status: "In Progress",
    links: [
      { label: "Algorithms & Data Structures Repository", url: "https://github.com/trekhleb/javascript-algorithms" },
      { label: "LeetCode Solutions Wiki", url: "https://github.com/kamyu104/LeetCode-Solutions" }
    ],
    checklist: [
      { id: "chk-2-1", label: "Implement a Binary Search Tree and Depth First Search traversal", done: true },
      { id: "chk-2-2", label: "Implement a custom caching decorator utilizing a hash map pattern", done: false },
      { id: "chk-2-3", label: "Benchmark performance gains of indexing versus raw sequential scan", done: false }
    ]
  },
  {
    id: "node-3",
    month: 1,
    title: "Collaborative Git & Version Control Pipelines",
    description: "Learn professional code collaboration strategies. Practice strict git conventions, branch isolation, and merging processes under code review conditions.",
    skills: ["Git Rebase", "Pull Requests", "SSH Configuration", "Semantic Versioning"],
    duration: "1 Week",
    status: "In Progress",
    links: [
      { label: "Git Flight Manual Guide", url: "https://github.com/539665/flight-manual" },
      { label: "Interactive Git Sandbox", url: "https://learngitbranching.js.org/" }
    ],
    checklist: [
      { id: "chk-3-1", label: "Configure secure cryptographic SSH keys for GitHub authentication", done: true },
      { id: "chk-3-2", label: "Practice resolving a rebase merge conflict inside a terminal sandbox", done: false },
      { id: "chk-3-3", label: "Establish a repository with custom pre-commit linting hooks", done: false }
    ]
  },

  // Month 2
  {
    id: "node-4",
    month: 2,
    title: "End-to-End AI Engineering Pipeline",
    description: "Design and implement a robust server-side machine learning system. Build a custom API that fetches data, queries a vector dataset, and outputs smart predictions.",
    skills: ["API Design", "Database Modeling", "Vector DBs", "Model Deployment"],
    duration: "3 Weeks",
    status: "Up Next",
    links: [
      { label: "Build a Modern API with Express", url: "https://expressjs.com/" },
      { label: "PostgreSQL & Schema Architectures", url: "https://www.postgresql.org/docs/" }
    ],
    checklist: [
      { id: "chk-4-1", label: "Construct standard UML system design diagrams explaining client-server limits", done: false },
      { id: "chk-4-2", label: "Build a fully secure Express API with schema validations and rate limits", done: false },
      { id: "chk-4-3", label: "Connect a high-performance vector retrieval store for searching dataset nodes", done: false }
    ]
  },
  {
    id: "node-5",
    month: 2,
    title: "Open-Source AI Library Contributions",
    description: "Contribute to the global development ecosystem. Learn to read large external codebases, write unit tests, and submit highly cohesive pull requests.",
    skills: ["Fork & Upstream", "Open Source Ethics", "Jest & Testing", "Automated Workflows"],
    duration: "2 Weeks",
    status: "Up Next",
    links: [
      { label: "First Contributions Guide Repo", url: "https://github.com/firstcontributions/first-contributions" },
      { label: "Awesome Open Source Catalog", url: "https://awesomeopensource.com/" }
    ],
    checklist: [
      { id: "chk-5-1", label: "Audit 3 active open-source repositories in your specialized tech track", done: false },
      { id: "chk-5-2", label: "Fix a documented documentation typo or small code bug on a public repo", done: false },
      { id: "chk-5-3", label: "Compose a comprehensive unit test suite with high code-coverage stats", done: false }
    ]
  },
  {
    id: "node-6",
    month: 2,
    title: "Hackathon Challenge & Rapid Prototyping",
    description: "Enter a live, collaborative hackathon environment. Build a highly modular web portal, deploy it, and present a compelling solution pitch.",
    skills: ["Rapid Prototyping", "Tailwind Integration", "Live Deployment", "Pitch Deck Craft"],
    duration: "2 Weeks",
    status: "Up Next",
    links: [
      { label: "Major League Hacking Guidelines", url: "https://mlh.io/" },
      { label: "Vercel Fast Deployment", url: "https://vercel.com/docs" }
    ],
    checklist: [
      { id: "chk-6-1", label: "Formulate or join an active, diverse hackathon cohort specializing in tech solutions", done: false },
      { id: "chk-6-2", label: "Implement responsive interfaces using clean tailwind layouts in under 48 hours", done: false },
      { id: "chk-6-3", label: "Produce a 2-minute video pitch highlighting the core solution and SDG values", done: false }
    ]
  },

  // Month 3
  {
    id: "node-7",
    month: 3,
    title: "Technical Resume & GitHub Optimization",
    description: "Elevate your professional visibility. Reframe your career milestones around measurable technical results and optimize your public code index.",
    skills: ["Resume Design", "GitHub Profile Markdown", "SEO Target Words", "Measurable Impact Metrics"],
    duration: "1 Week",
    status: "Up Next",
    links: [
      { label: "Awesome GitHub Profile Readme Template", url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme" },
      { label: "Tech Resume Checklist Guide", url: "https://github.com/jwasham/coding-interview-university" }
    ],
    checklist: [
      { id: "chk-7-1", label: "Translate passive resume tasks into action-oriented statements: 'Shipped X, achieving Y%'", done: false },
      { id: "chk-7-2", label: "Add an elegant markdown landing page to your GitHub profile containing stats", done: false },
      { id: "chk-7-3", label: "Vectored clean badges highlighting your specialized skills on LinkedIn profiles", done: false }
    ]
  },
  {
    id: "node-8",
    month: 3,
    title: "Comprehensive Portfolio Showcase",
    description: "Launch your personal brand hub. Design, build, and deploy an ultra-responsive web portfolio demonstrating all the milestones completed over the roadmap.",
    skills: ["Hosting & DNS", "Lighthouse Benchmarking", "Responsive Aesthetics", "CI/CD Deployment"],
    duration: "2 Weeks",
    status: "Up Next",
    links: [
      { label: "Netlify Hosting Core", url: "https://www.netlify.com/" },
      { label: "Lighthouse Performance Audit", url: "https://developer.chrome.com/docs/lighthouse/" }
    ],
    checklist: [
      { id: "chk-8-1", label: "Build an interactive, fast portfolio utilizing responsive tailwind layouts", done: false },
      { id: "chk-8-2", label: "Conduct a full Lighthouse audit ensuring >95% scores on performance and accessibility", done: false },
      { id: "chk-8-3", label: "Map a personalized custom domain with automatic SSL security certificates", done: false }
    ]
  },
  {
    id: "node-9",
    month: 3,
    title: "Mock Interviews & Negotiation Calibration",
    description: "Prepare to claim your market worth. Run exhaustive technical mock interviews and practice state-of-the-art salary negotiation rebuttals.",
    skills: ["STAR Methodology", "System Design Patterns", "Negotiation Frameworks", "Imposter Rebuttal"],
    duration: "2 Weeks",
    status: "Up Next",
    links: [
      { label: "System Design Primer Guide", url: "https://github.com/donnemartin/system-design-primer" },
      { label: "Levels.fyi Transparency Benchmarks", url: "https://www.levels.fyi/" }
    ],
    checklist: [
      { id: "chk-9-1", label: "Execute 5 video mock interviews practicing structural behavioral responses (STAR)", done: false },
      { id: "chk-9-2", label: "Study database horizontal scalability, sharding, and latency considerations", done: false },
      { id: "chk-9-3", label: "Calibrate 3 salary negotiation rebuttals directly referencing your custom achievements", done: false }
    ]
  }
];

export default function AICareerPath() {
  const [currentRole, setCurrentRole] = useState("1st Year B.Tech Student");
  const [targetRole, setTargetRole] = useState("AI Engineering Lead");
  const [nodes, setNodes] = useState<RoadmapNode[]>(INITIAL_NODES);
  const [activeMonth, setActiveMonth] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>("node-1");

  // Toggle checklist task item
  const handleToggleChecklist = (nodeId: string, checkId: string) => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id !== nodeId) return node;

      const updatedChecklist = node.checklist.map(item => {
        if (item.id === checkId) {
          return { ...item, done: !item.done };
        }
        return item;
      });

      // Calculate new status based on checked items
      const totalCount = updatedChecklist.length;
      const doneCount = updatedChecklist.filter(c => c.done).length;
      
      let newStatus: 'Completed' | 'In Progress' | 'Up Next' = node.status;
      if (doneCount === totalCount) {
        newStatus = 'Completed';
      } else if (doneCount > 0) {
        newStatus = 'In Progress';
      } else {
        newStatus = 'Up Next';
      }

      return {
        ...node,
        checklist: updatedChecklist,
        status: newStatus
      };
    }));
  };

  // Change node status manually
  const handleStatusChange = (nodeId: string, newStatus: 'Completed' | 'In Progress' | 'Up Next') => {
    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id !== nodeId) return node;
      
      // Sync checklist if changed to completed
      let updatedChecklist = [...node.checklist];
      if (newStatus === 'Completed') {
        updatedChecklist = node.checklist.map(item => ({ ...item, done: true }));
      } else if (newStatus === 'Up Next') {
        updatedChecklist = node.checklist.map(item => ({ ...item, done: false }));
      }

      return {
        ...node,
        status: newStatus,
        checklist: updatedChecklist
      };
    }));
  };

  // Call the newly created backend API
  const handleGenerateRoadmap = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const response = await fetch('/api/90day-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentRole, targetRole }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.nodes && Array.isArray(data.nodes)) {
        setNodes(data.nodes);
        setActiveMonth(1);
        // Default select the first node of Month 1
        const month1Nodes = data.nodes.filter((n: any) => n.month === 1);
        if (month1Nodes.length > 0) {
          setActiveNodeId(month1Nodes[0].id);
        }
        setSuccessMsg(`Successfully generated customized 90-day pathway from ${currentRole} to ${targetRole}!`);
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        throw new Error("Invalid roadmap schema received");
      }
    } catch (err: any) {
      console.error("Failed to generate 90-day roadmap:", err);
      setError("Unable to generate custom pathway. Loaded optimized fallback roadmap instead.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Reset progress to original mock setup
  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all your progress data?")) {
      setNodes(INITIAL_NODES);
      setActiveMonth(1);
      setActiveNodeId("node-1");
    }
  };

  // Derived progress statistics
  const totalNodes = nodes.length;
  const completedNodesCount = nodes.filter(n => n.status === 'Completed').length;
  const inProgressNodesCount = nodes.filter(n => n.status === 'In Progress').length;
  const overallProgressPercentage = totalNodes > 0 
    ? Math.round((completedNodesCount / totalNodes) * 100) 
    : 0;

  // Monthly stats
  const getMonthProgress = (m: number) => {
    const monthNodes = nodes.filter(n => n.month === m);
    if (monthNodes.length === 0) return 0;
    const completed = monthNodes.filter(n => n.status === 'Completed').length;
    return Math.round((completed / monthNodes.length) * 100);
  };

  return (
    <div className="w-full text-white space-y-10" id="ai-career-pathway-engine">
      {/* Title Header Section */}
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1437]/60 border border-[#A144FF]/25 rounded-full text-[#A5A1B8] text-xs font-semibold mb-4 tracking-wider animate-pulse uppercase">
          <Sparkles size={14} className="text-[#E841A1]" />
          Empowerment Engine • UN SDG 5 Partner
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-slate-100 to-[#A5A1B8] bg-clip-text text-transparent">
          HorizonPath AI
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#A5A1B8] max-w-2xl mx-auto leading-relaxed">
          Break systemic barriers and claim your space in artificial intelligence. Leverage custom-targeted 90-day learning checkpoints, interactive milestone trackers, and vetted open-source technical databases.
        </p>
      </div>

      {/* Control Panel: Career Objective Input Header */}
      <div className="bg-[#1F1437]/25 backdrop-blur-xl border border-[#A144FF]/10 p-6 rounded-2xl shadow-xl shadow-black/20 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A144FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#E841A1]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Compass className="text-[#E841A1]" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Set Your Aspirational Pathway Targets
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            {/* Current Role Select */}
            <div className="md:col-span-4 space-y-2 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A5A1B8] font-mono">
                Current Standing / Role
              </label>
              <div className="relative">
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="w-full appearance-none bg-[#0B0F17]/90 border border-[#A144FF]/15 hover:border-[#A144FF]/30 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#A144FF] transition-all cursor-pointer font-medium"
                >
                  {CURRENT_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role} className="bg-[#0B0F17] text-white">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Stepper Arrow Indicator */}
            <div className="hidden md:flex md:col-span-1 justify-center pb-3">
              <ArrowRight className="text-[#A144FF] animate-pulse" size={20} />
            </div>

            {/* Target Role Select */}
            <div className="md:col-span-4 space-y-2 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A5A1B8] font-mono">
                Aspirational Target Role
              </label>
              <div className="relative">
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full appearance-none bg-[#0B0F17]/90 border border-[#A144FF]/15 hover:border-[#A144FF]/30 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#A144FF] transition-all cursor-pointer font-medium"
                >
                  {TARGET_ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role} className="bg-[#0B0F17] text-white">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#E841A1] via-[#A144FF] to-[#1F1437] hover:opacity-95 active:scale-[0.98] transition-all py-3 px-5 rounded-xl font-bold text-sm text-white shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Mapping Core Skills...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-white group-hover:rotate-12 transition-transform" />
                    <span>Generate 90-Day Empowerment Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          <AnimatePresence mode="wait">
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 size={14} />
                {successMsg}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-medium flex items-center gap-2"
              >
                <CheckCircle2 size={14} className="text-amber-400" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Progress Statistics Widget */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        <div className="md:col-span-8 bg-[#1F1437]/25 border border-[#A144FF]/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A5A1B8] font-mono">
                Overall Career Milestone Progress
              </span>
              <h4 className="text-lg font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <Layers size={16} className="text-[#A144FF]" />
                {completedNodesCount} of {totalNodes} Target Checkpoints Achieved
              </h4>
            </div>
            <span className="text-xl font-black font-mono text-[#E841A1]">
              {overallProgressPercentage}%
            </span>
          </div>

          {/* Progress bar container */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-950 rounded-full h-3 border border-white/5 overflow-hidden p-[1px]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgressPercentage}%` }}
                transition={{ duration: 0.6 }}
                className="h-full rounded-full bg-gradient-to-r from-[#E841A1] via-[#A144FF] to-[#1F1437] shadow-lg shadow-[#A144FF]/20"
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#A5A1B8]/60 uppercase">
              <span>Day 1: Basecamp</span>
              <span>Day 45: Project Sync</span>
              <span>Day 90: Interview Calibration</span>
            </div>
          </div>
        </div>

        {/* Counter Stats */}
        <div className="md:col-span-4 bg-[#1F1437]/25 border border-[#A144FF]/10 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#A144FF]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A5A1B8] font-mono">
              Status Breakdown
            </span>
            <button
              onClick={handleResetProgress}
              className="text-[10px] font-mono uppercase tracking-wider text-[#A5A1B8]/60 hover:text-white flex items-center gap-1 transition-colors"
              title="Reset progress metrics"
            >
              <RotateCcw size={10} /> Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center">
            <div className="p-2 bg-[#1F1437]/35 rounded-xl border border-white/5">
              <span className="text-lg font-bold font-mono text-[#00FFA3]">
                {completedNodesCount}
              </span>
              <span className="block text-[8px] text-[#A5A1B8] font-mono uppercase">Done</span>
            </div>
            <div className="p-2 bg-[#1F1437]/35 rounded-xl border border-white/5">
              <span className="text-lg font-bold font-mono text-amber-400">
                {inProgressNodesCount}
              </span>
              <span className="block text-[8px] text-[#A5A1B8] font-mono uppercase">Active</span>
            </div>
            <div className="p-2 bg-[#1F1437]/35 rounded-xl border border-white/5">
              <span className="text-lg font-bold font-mono text-[#A5A1B8]">
                {totalNodes - completedNodesCount - inProgressNodesCount}
              </span>
              <span className="block text-[8px] text-[#A5A1B8] font-mono uppercase">Next</span>
            </div>
          </div>

          <div className="text-[10px] text-[#A5A1B8]/50 font-mono flex items-center gap-1 border-t border-white/5 pt-2">
            <CheckCircle2 size={11} className="text-[#A144FF]" />
            <span>Updates dynamically based on tasks</span>
          </div>
        </div>
      </div>

      {/* Visual Timeline Stepper (Month Selectors) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A144FF] font-mono block">
              Timeframe Milestones
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Roadmap Chronology (Month 1 to 3)
            </h3>
          </div>

          {/* Stepper Month Nav Buttons */}
          <div className="flex gap-2 w-full sm:w-auto bg-slate-950/80 border border-[#A144FF]/10 p-1 rounded-2xl">
            {[
              { m: 1, title: "Month 1", label: "Foundation", icon: <Code size={13} /> },
              { m: 2, title: "Month 2", label: "Project & OS", icon: <BookOpenCheck size={13} /> },
              { m: 3, title: "Month 3", label: "Career Ready", icon: <Briefcase size={13} /> }
            ].map((monthObj) => {
              const prog = getMonthProgress(monthObj.m);
              const isActive = activeMonth === monthObj.m;
              return (
                <button
                  key={monthObj.m}
                  type="button"
                  onClick={() => {
                    setActiveMonth(monthObj.m);
                    // Select first node of that month automatically
                    const mNodes = nodes.filter(n => n.month === monthObj.m);
                    if (mNodes.length > 0) {
                      setActiveNodeId(mNodes[0].id);
                    }
                  }}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl transition-all duration-150 flex flex-col items-center sm:items-start text-center sm:text-left min-w-[100px] ${
                    isActive
                      ? 'bg-[#E841A1]/10 border border-[#E841A1]/30 text-[#E841A1]'
                      : 'border border-transparent text-[#A5A1B8] hover:text-white hover:bg-[#1F1437]/25'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                     {monthObj.icon}
                    <span className="text-xs font-bold">{monthObj.title}</span>
                  </div>
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#A5A1B8]/60 mt-0.5">
                    {monthObj.label} ({prog}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Columns: Nodes List (Left) + Focused Node Details (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          {/* Node Cards Stepper Timeline (Left Column) */}
          <div className="lg:col-span-5 space-y-4 relative">
            {/* Visual Dotted connection vertical line */}
            <div className="absolute left-[29px] top-4 bottom-4 w-[2px] bg-dashed border-l border-dashed border-[#A144FF]/20 pointer-events-none" />

            {nodes
              .filter(node => node.month === activeMonth)
              .map((node, index) => {
                const totalChecks = node.checklist.length;
                const completedChecks = node.checklist.filter(c => c.done).length;
                const isActive = activeNodeId === node.id;

                let badgeColor = "bg-[#1F1437]/60 text-[#A5A1B8] border-[#A144FF]/10";
                if (node.status === 'Completed') {
                  badgeColor = "bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/20";
                } else if (node.status === 'In Progress') {
                  badgeColor = "bg-amber-400/10 text-amber-400 border-amber-400/20";
                }

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-start gap-4 relative group ${
                      isActive
                        ? 'bg-[#1F1437]/45 border-[#A144FF] shadow-lg shadow-[#A144FF]/10'
                        : 'bg-[#1F1437]/15 border border-[#A144FF]/10 hover:bg-[#1F1437]/25 hover:border-[#A144FF]/25'
                    }`}
                  >
                    {/* Stepper Circle */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#E841A1] to-[#A144FF] text-white shadow-md shadow-[#A144FF]/20 scale-105'
                          : 'bg-[#1F1437]/50 text-[#A5A1B8] border border-[#A144FF]/20'
                      }`}>
                        {(activeMonth - 1) * 3 + index + 1}
                      </div>
                      
                      {/* Inner check icon if complete */}
                      {node.status === 'Completed' && (
                        <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full border border-[#0B0F17]">
                          <Check size={8} strokeWidth={4} />
                        </span>
                      )}
                    </div>

                    {/* Step Card Details */}
                    <div className="space-y-2 flex-grow overflow-hidden">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-bold leading-snug truncate ${
                          isActive ? 'text-white' : 'text-[#A5A1B8] group-hover:text-white'
                        }`}>
                          {node.title}
                        </h4>
                        <ChevronRight 
                          size={14} 
                          className={`text-slate-500 mt-1 flex-shrink-0 transition-transform ${
                            isActive ? 'translate-x-1 text-[#A144FF]' : ''
                          }`} 
                        />
                      </div>

                      <p className="text-xs text-[#A5A1B8] line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {/* Status Badge */}
                        <span className={`text-[9px] font-bold font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${badgeColor}`}>
                          {node.status}
                        </span>

                        {/* Checklist progress */}
                        <span className="text-[10px] text-[#A5A1B8]/70 font-mono">
                          {completedChecks}/{totalChecks} Tasks
                        </span>

                        {/* Estimated Duration Badge */}
                        <span className="text-[10px] text-[#A5A1B8]/70 font-mono flex items-center gap-0.5">
                          <Clock size={10} />
                          {node.duration}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Detailed Selected Node Board (Right Column) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {(() => {
                const node = nodes.find(n => n.id === activeNodeId);
                if (!node) {
                  return (
                    <div className="bg-[#1F1437]/25 border border-[#A144FF]/10 p-12 rounded-2xl text-center text-[#A5A1B8] min-h-[450px] flex flex-col justify-center items-center">
                      <Compass size={40} className="text-[#A5A1B8]/60 mb-3 animate-pulse" />
                      <p className="text-sm font-mono uppercase tracking-wider">
                        Select a milestone node to inspect custom checkpoints
                      </p>
                    </div>
                  );
                }

                const totalChecks = node.checklist.length;
                const doneChecks = node.checklist.filter(c => c.done).length;
                const nodeProgress = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#1F1437]/25 backdrop-blur-xl border border-[#A144FF]/10 p-6 rounded-2xl shadow-xl shadow-black/25 flex flex-col justify-between min-h-[480px] relative overflow-hidden"
                  >
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E841A1] via-[#A144FF] to-[#1F1437]" />

                    <div className="space-y-6">
                      {/* Card Header Info */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#E841A1] font-bold block">
                            Month {node.month} • Core Focus Pathway
                          </span>
                          <h3 className="text-lg font-bold text-white leading-snug mt-1">
                            {node.title}
                          </h3>
                        </div>

                        {/* Status Manual Selector */}
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[10px] text-[#A5A1B8] font-mono uppercase font-semibold">
                            Status:
                          </span>
                          <div className="relative">
                            <select
                              value={node.status}
                              onChange={(e) => handleStatusChange(node.id, e.target.value as any)}
                              className={`appearance-none font-mono text-[10px] font-bold uppercase tracking-wider bg-slate-900 border px-3 py-1.5 pr-8 rounded-lg text-slate-200 focus:outline-none focus:border-[#A144FF] transition-all cursor-pointer ${
                                node.status === 'Completed'
                                  ? 'border-[#00FFA3]/40 text-[#00FFA3]'
                                  : node.status === 'In Progress'
                                    ? 'border-amber-500/40 text-amber-400'
                                    : 'border-[#A144FF]/10 text-[#A5A1B8]'
                              }`}
                            >
                              <option value="Completed">Completed</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Up Next">Up Next</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                              <ChevronDown size={11} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description Block */}
                      <div className="space-y-2">
                        <span className="block text-[10px] font-bold text-[#A5A1B8] uppercase tracking-wider font-mono">
                          Checklist Objective Description:
                        </span>
                        <p className="text-xs text-[#A5A1B8] leading-relaxed">
                          {node.description}
                        </p>
                      </div>

                      {/* Skill Tags */}
                      <div className="space-y-2.5">
                        <span className="block text-[10px] font-bold text-[#A5A1B8] uppercase tracking-wider font-mono">
                          Target Core Skills & Tooling Stack:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {node.skills.map((skill, idx) => (
                            <span 
                              key={idx}
                              className="text-[10px] font-mono font-bold text-[#E841A1] bg-[#E841A1]/10 border border-[#E841A1]/20 rounded px-2.5 py-1"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Progress Checkboxes */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="block text-[10px] font-bold text-[#A5A1B8] uppercase tracking-wider font-mono">
                            Interactive Task Checkpoint Checklist:
                          </span>
                          <span className="text-[10px] font-mono text-[#A144FF] font-bold">
                            {nodeProgress}% Done
                          </span>
                        </div>

                        <div className="space-y-2">
                          {node.checklist.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => handleToggleChecklist(node.id, item.id)}
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                item.done 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30' 
                                  : 'bg-slate-950/40 border border-[#A144FF]/10 hover:border-[#A144FF]/25'
                              }`}
                            >
                              <button
                                type="button"
                                className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                                  item.done 
                                    ? 'bg-[#00FFA3] border-[#00FFA3] text-slate-950' 
                                    : 'border-[#A144FF]/30 hover:border-[#E841A1]'
                                }`}
                              >
                                {item.done && <Check size={12} strokeWidth={3} />}
                              </button>
                              <p className={`text-xs leading-relaxed transition-all select-none ${
                                item.done ? 'text-[#A5A1B8]/40 line-through' : 'text-[#A5A1B8]'
                              }`}>
                                {item.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Curated Open-Source links */}
                      <div className="space-y-2.5 border-t border-white/5 pt-4">
                        <span className="block text-[10px] font-bold text-[#A5A1B8] uppercase tracking-wider font-mono">
                          Curated Open-Source Resources & Repositories:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {node.links.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              referrerPolicy="no-referrer"
                              className="flex items-center justify-between p-2.5 bg-[#1F1437]/30 hover:bg-[#1F1437]/65 border border-[#A144FF]/10 hover:border-[#A144FF]/25 rounded-xl text-xs text-[#A5A1B8] hover:text-white transition-all group"
                            >
                              <span className="flex items-center gap-1.5 font-medium truncate">
                                <BookOpen size={12} className="text-[#A144FF] group-hover:text-[#E841A1] transition-colors" />
                                {link.label}
                              </span>
                              <ExternalLink size={11} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Progress feedback banner footer */}
                    <div className="border-t border-white/5 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-pink-400" />
                        Target Study Period: {node.duration}
                      </span>
                      <div className="flex items-center gap-1 text-pink-400 font-semibold">
                        <span>UN SDG 5 representation standard</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Empowerment Milestone Commitment Quote */}
      <div className="bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 border border-purple-500/20 p-6 rounded-2xl text-center space-y-3 relative overflow-hidden">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-5 font-serif text-8xl text-purple-400 pointer-events-none select-none">
          “
        </div>
        <p className="text-xs sm:text-sm text-slate-300 italic max-w-2xl mx-auto leading-relaxed relative z-10">
          "Artificial intelligence will shape the future of human society. To ensure this future is fair, diverse, and robust, women must not only participate—they must lead the algorithms, dictate the schemas, and command the boardrooms."
        </p>
        <span className="block text-[9px] font-mono uppercase tracking-wider text-purple-400 font-bold">
          HerHorizon Technical Mentorship Coalition • SDG 5 Commitments
        </span>
      </div>
    </div>
  );
}
