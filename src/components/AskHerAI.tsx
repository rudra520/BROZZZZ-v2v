import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Compass, 
  DollarSign, 
  ShieldAlert, 
  Users,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Message } from '../types';

const SUGGESTED_PROMPTS = [
  {
    icon: <DollarSign size={14} className="text-pink-400" />,
    label: 'Ask about Salary Negotiation',
    prompt: 'How do I justify a 20% raise during my performance review as a software engineer?'
  },
  {
    icon: <Sparkles size={14} className="text-purple-400" />,
    label: 'Scholarship Essay Hook',
    prompt: 'Help me draft a compelling introductory paragraph for a STEM research micro-grant about artificial intelligence.'
  },
  {
    icon: <Users size={14} className="text-emerald-400" />,
    label: 'Leadership Advice',
    prompt: 'How can I establish technical credibility and lead effectively in a heavily male-dominated FinTech team?'
  },
  {
    icon: <Compass size={14} className="text-violet-400" />,
    label: 'Career Transition',
    prompt: 'I have a background in traditional business. What is the most realistic pathway to transition into Blockchain Cryptography?'
  }
];

export default function AskHerAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am **Ask-Her-AI**, your dedicated career mentor and strategic partner. Whether you are navigating complex salary negotiations, planning scholarship statements, seeking STEM leadership blueprints, or conquering technical boundaries, I am here to empower your journey. How can I support your success today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      if (data && data.text) {
        const assistantMessage: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data?.error || "Invalid response format");
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback response in case server is unavailable
      const fallbackMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: "I'm having trouble reaching the mainframe at the moment. However, based on career optimization standards: \n\n1. Always document your accomplishments with quantifiable metrics (e.g., 'reduced API response times by 30%').\n2. Establish active mentorship networks.\n3. Remain firm on your fair-market valuation. \n\nLet me know if there's anything else I can outline!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Safe custom Markdown formatter helper
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      let content = line;
      
      // Check for bullet lists starting with - or *
      const isBullet = content.trim().startsWith('-') || content.trim().startsWith('*');
      if (isBullet) {
        content = content.replace(/^[\s-*]+/, '');
      }

      // Check for bold matches (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="text-white font-bold bg-white/5 px-1 rounded">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex));
      }

      const renderedLine = parts.length > 0 ? parts : content;

      if (isBullet) {
        return (
          <div key={lineIdx} className="flex gap-2 items-start ml-4 my-1.5 text-slate-300 leading-relaxed text-sm">
            <span className="text-purple-400 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={`${line.trim() === '' ? 'h-3' : 'my-1.5'} text-slate-300 leading-relaxed text-sm`}>
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="w-full text-white" id="ask-her-ai-section">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/15 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold mb-3 animate-pulse">
          <MessageSquare size={14} />
          Ask-Her-AI Mentoring Chat
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Consult Your AI Career Ally
        </h2>
        <p className="mt-3 text-lg text-slate-400">
          Gain immediate access to premium counseling on salary strategies, technical growth plans, and boardroom navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Left Suggested Chips */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 order-2 lg:order-1">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-xl shadow-black/25 text-left space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <HelpCircle size={16} className="text-pink-400" />
              Strategic Prompts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any of our precision-engineered prompt vectors to trigger specialized mentoring sessions instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={loading}
                  className="w-full p-3 bg-slate-900/50 border border-white/5 hover:border-purple-500/40 rounded-xl text-left text-xs text-slate-300 hover:bg-white/5 transition-all flex items-start gap-3 duration-150 disabled:opacity-50"
                >
                  <div className="flex-shrink-0 mt-0.5 p-1 bg-white/5 rounded-lg border border-white/10">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-[11px] mb-0.5">{item.label}</p>
                    <p className="text-slate-400 text-[10px] line-clamp-1">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ethics / Trust Info box */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl text-left flex items-start gap-3">
            <div className="p-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl flex-shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secured & Confidential</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                All mentorship dialog is audited client-side and proxied securely. No telemetry or PII data is persisted externally.
              </p>
            </div>
          </div>
        </div>

        {/* Right Active Chat Console */}
        <div className="lg:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl shadow-black/25 flex flex-col justify-between overflow-hidden h-[540px] order-1 lg:order-2">
          {/* Header Console */}
          <div className="px-6 py-4 bg-slate-950/40 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-violet-500 flex items-center justify-center border border-white/15 shadow-inner">
                <Sparkles size={16} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Ask-Her-AI
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">Active Mentorship Vector</p>
              </div>
            </div>
          </div>

          {/* Dialog Bubble scroll view */}
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
              >
                {/* Avatar icon */}
                <div className={`w-8 h-8 rounded-full border flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' 
                    : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>

                {/* Text Bubble */}
                <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-pink-500/10 border border-pink-500/20 text-slate-200 rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="text-left">
                    {renderFormattedText(msg.content)}
                  </div>
                  <span className="block text-[9px] text-slate-600 font-mono mt-2 uppercase tracking-widest text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] text-left">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center animate-spin">
                  <Sparkles size={14} />
                </div>
                <div className="rounded-2xl p-4 bg-white/5 border border-white/10 text-slate-400 rounded-tl-none text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce delay-200" />
                  Ask-Her-AI is evaluating pathways...
                </div>
              </div>
            )}
          </div>

          {/* Input control tray */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }}
            className="p-4 bg-slate-950/40 border-t border-white/5 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Inquire about equity, salary structures, academic roadmaps..."
              className="flex-1 px-4 py-2.5 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-tr from-pink-500 to-purple-600 hover:opacity-95 active:scale-95 text-white rounded-xl transition-all shadow-md shadow-purple-500/10 disabled:opacity-50 disabled:active:scale-100"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
