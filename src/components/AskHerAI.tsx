import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  User, 
  HelpCircle, 
  Compass, 
  DollarSign, 
  ShieldAlert, 
  Users,
  MessageSquare
} from 'lucide-react';
import { Message } from '../types';

const SUGGESTED_PROMPTS = [
  {
    icon: <DollarSign size={14} className="text-[#E841A1]" />,
    label: 'Ask about Salary Negotiation',
    prompt: 'How do I justify a 20% raise during my performance review as a software engineer?'
  },
  {
    icon: <Sparkles size={14} className="text-[#A144FF]" />,
    label: 'Scholarship Essay Hook',
    prompt: 'Help me draft a compelling introductory paragraph for a STEM research micro-grant about artificial intelligence.'
  },
  {
    icon: <Users size={14} className="text-[#00FFA3]" />,
    label: 'Leadership Advice',
    prompt: 'How can I establish technical credibility and lead effectively in a heavily male-dominated FinTech team?'
  },
  {
    icon: <Compass size={14} className="text-[#A144FF]" />,
    label: 'Career Transition',
    prompt: 'I have a background in traditional business. What is the most realistic pathway to transition into Blockchain Cryptography?'
  }
];

export default function AskHerAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am **Dea AI**, your dedicated career mentor and strategic partner. Whether you are navigating complex salary negotiations, planning scholarship statements, seeking STEM leadership blueprints, or conquering technical boundaries, I am here to empower your journey. How can I support your success today?",
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

  useEffect(() => {
    const query = localStorage.getItem('ask_her_ai_initial_query');
    if (query) {
      localStorage.removeItem('ask_her_ai_initial_query');
      setTimeout(() => {
        handleSendMessage(query);
      }, 400);
    }
  }, []);

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

  // Safe custom Markdown formatter helper using ReactMarkdown
  const renderFormattedText = (text: string) => {
    return (
      <div className="markdown-body space-y-2 text-[#A5A1B8] leading-relaxed text-sm">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 leading-relaxed text-sm text-[#A5A1B8]">{children}</p>,
            strong: ({ children }) => <strong className="text-white font-bold bg-[#1F1437] px-1 rounded">{children}</strong>,
            h1: ({ children }) => <h1 className="text-lg font-bold text-white mt-4 mb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-base font-bold text-white mt-3 mb-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-sm font-bold text-white mt-2 mb-1">{children}</h3>,
            ul: ({ children }) => <ul className="list-none pl-2 space-y-1.5 my-2">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1.5 my-2">{children}</ol>,
            li: ({ children }) => (
              <li className="flex gap-2 items-start text-[#A5A1B8] text-sm my-1">
                <span className="text-[#A144FF] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#A144FF]" />
                <span className="flex-1 leading-relaxed">{children}</span>
              </li>
            ),
            code: ({ children }) => <code className="bg-[#1F1437]/60 text-pink-400 font-mono text-xs px-1.5 py-0.5 rounded border border-[#A144FF]/10">{children}</code>,
            pre: ({ children }) => <pre className="bg-[#1F1437]/40 border border-[#A144FF]/10 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono">{children}</pre>
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="w-full text-white" id="ask-her-ai-section">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1F1437]/60 border border-[#A144FF]/25 rounded-full text-[#A5A1B8] text-xs font-semibold mb-3 animate-pulse">
          <MessageSquare size={14} />
          Dea AI Mentoring Chat
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-r from-white via-[#A5A1B8] to-[#A5A1B8] bg-clip-text text-transparent">
          Consult Your AI Career Ally
        </h2>
        <p className="mt-3 text-lg text-[#A5A1B8]">
          Gain immediate access to premium counseling on salary strategies, technical growth plans, and boardroom navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Left Suggested Chips */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6 order-2 lg:order-1">
          <div className="bg-[#1F1437]/25 backdrop-blur-xl border border-[#A144FF]/10 p-6 rounded-2xl shadow-xl shadow-black/25 text-left space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#A5A1B8] flex items-center gap-2">
              <HelpCircle size={16} className="text-[#E841A1]" />
              Strategic Prompts
            </h3>
            <p className="text-xs text-[#A5A1B8] leading-relaxed">
              Click any of our precision-engineered prompt vectors to trigger specialized mentoring sessions instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              {SUGGESTED_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(item.prompt)}
                  disabled={loading}
                  className="w-full p-3 bg-[#1F1437]/15 border border-[#A144FF]/10 hover:border-[#A144FF]/35 rounded-xl text-left text-xs text-[#A5A1B8] hover:bg-[#1F1437]/35 transition-all flex items-start gap-3 duration-150 disabled:opacity-50"
                >
                  <div className="flex-shrink-0 mt-0.5 p-1 bg-white/5 rounded-lg border border-white/10">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-white text-[11px] mb-0.5">{item.label}</p>
                    <p className="text-[#A5A1B8] text-[10px] line-clamp-1">{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ethics / Trust Info box */}
          <div className="bg-[#1F1437]/25 backdrop-blur-xl border border-[#A144FF]/10 p-5 rounded-2xl shadow-xl text-left flex items-start gap-3">
            <div className="p-2 bg-[#E841A1]/10 border border-[#E841A1]/20 text-[#E841A1] rounded-xl flex-shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Secured & Confidential</h4>
              <p className="text-[10px] text-[#A5A1B8] leading-relaxed mt-1">
                All mentorship dialog is audited client-side and proxied securely. No telemetry or PII data is persisted externally.
              </p>
            </div>
          </div>
        </div>

        {/* Right Active Chat Console */}
        <div className="lg:col-span-8 bg-[#1F1437]/25 backdrop-blur-xl border border-[#A144FF]/10 rounded-2xl shadow-xl shadow-black/25 flex flex-col justify-between overflow-hidden h-[540px] order-1 lg:order-2">
          {/* Header Console */}
          <div className="px-6 py-4 bg-slate-950/60 border-b border-[#A144FF]/10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E841A1] via-[#A144FF] to-[#1F1437] flex items-center justify-center border border-[#A144FF]/25 shadow-inner">
                <Sparkles size={16} className="text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Dea AI
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                </h3>
                <p className="text-[10px] text-[#A5A1B8]/60 uppercase font-mono tracking-wider">Zero-Cost Offline RAG Pipeline</p>
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
                    ? 'bg-[#E841A1]/10 border border-[#E841A1]/20 text-[#E841A1]' 
                    : 'bg-[#A144FF]/10 border border-[#A144FF]/20 text-[#A144FF]'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                </div>

                {/* Text Bubble */}
                <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-1 ${
                  msg.role === 'user'
                    ? 'bg-[#E841A1]/10 border border-[#E841A1]/20 text-[#A5A1B8] rounded-tr-none'
                    : 'bg-[#1F1437]/35 border border-[#A144FF]/10 text-[#A5A1B8] rounded-tl-none'
                }`}>
                  <div className="text-left">
                    {renderFormattedText(msg.content)}
                  </div>
                  <span className="block text-[9px] text-[#A5A1B8]/40 font-mono mt-2 uppercase tracking-widest text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-[85%] text-left">
                <div className="w-8 h-8 rounded-full bg-[#A144FF]/10 border border-[#A144FF]/20 text-[#A144FF] flex items-center justify-center animate-spin">
                  <Sparkles size={14} />
                </div>
                <div className="rounded-2xl p-4 bg-[#1F1437]/35 border border-[#A144FF]/10 text-[#A5A1B8] rounded-tl-none text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#E841A1] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#A144FF] rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-[#A144FF] rounded-full animate-bounce delay-200" />
                  Dea AI is evaluating pathways...
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
            className="p-4 bg-slate-950/60 border-t border-[#A144FF]/10 flex gap-3 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Inquire about equity, salary structures, academic roadmaps..."
              className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-[#A144FF]/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#A144FF] transition-all placeholder:text-[#A5A1B8]/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-gradient-to-tr from-[#E841A1] to-[#A144FF] hover:opacity-95 active:scale-95 text-white rounded-xl transition-all shadow-md shadow-[#A144FF]/15 disabled:opacity-50 disabled:active:scale-100"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
