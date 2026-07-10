import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Paperclip, 
  Mic, 
  MicOff,
  CornerDownLeft,
  Check,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Message } from '../types';

const FLOATING_CHIPS = [
  "Review my engineering resume for AI roles",
  "How do I answer salary expectation questions?",
  "Tips for my first technical hackathon pitch"
];

export default function AskHerAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'widget-welcome',
      role: 'assistant',
      content: "Hello! I am **Dea AI**, your 24/7 STEM Career & Mentorship ally. I am trained to review engineering resumes, optimize negotiation dialogues, calibrate technical portfolio statements, and help you conquer STEM hurdles. How can I guide you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachSuccess, setAttachSuccess] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom of the widget container safely without scrolling the main viewport
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      const container = chatContainerRef.current;
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [messages, loading, isOpen, isListening]);

  // Handle files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAttachedFile(file);
      setAttachSuccess(true);
      setTimeout(() => setAttachSuccess(false), 2000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Simulate voice dictation
  const handleVoiceToggle = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    // Simulate auto-typing soundwave input after 2 seconds
    setTimeout(() => {
      setIsListening(false);
      const dictationSample = "Review my engineering resume for AI roles and advise on skills";
      // Animate typing effect
      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength < dictationSample.length) {
          setInput(dictationSample.substring(0, currentLength + 1));
          currentLength++;
        } else {
          clearInterval(interval);
        }
      }, 20);
    }, 2500);
  };

  // Send query
  const handleSendMessage = async (textToSend: string) => {
    const trimmedText = textToSend.trim();
    if (!trimmedText && !attachedFile) return;

    let finalPrompt = trimmedText;
    if (attachedFile) {
      finalPrompt = `[Attached Document: ${attachedFile.name}] \n\n${trimmedText || "Could you analyze my attached resume profile and advise on transition steps?"}`;
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: finalPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    removeAttachment();
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
        throw new Error(`Server status: ${response.status}`);
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
        throw new Error("Invalid response schema");
      }
    } catch (err: any) {
      console.error("Widget chat failure:", err);
      // Encourage fallback content
      const fallbackContent = `I received your request: "${trimmedText}". Here is some actionable career guidance for this topic:

**1. Tailor to Quantifiable Technical Gaps**
Align your project experience specifically with model constraints, data loader optimizations, and API architectures. Ensure your code showcases clean Git semantic structures.

**2. State Your Market Standard Confidently**
Whether handling salary questions or mock evaluations, anchor on facts. Let your accomplishments define the premium valuation standard.

**3. Practice Pitch Articulation**
In any hackathon or presentation, describe the Problem, the unique Machine Learning Solution, and the Direct Social Impact under standard UN guidelines.

Please retry your connection in a moment once the capacity stabilizes!`;

      const fallbackMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Custom Markdown renderer inside widget bubble
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      let content = line;
      const isBullet = content.trim().startsWith('-') || content.trim().startsWith('*');
      if (isBullet) {
        content = content.replace(/^[\s-*]+/, '');
      }

      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(content.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="text-white font-bold bg-[#1F1437] px-1 rounded">
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
          <div key={lineIdx} className="flex gap-1.5 items-start ml-2 my-1 text-[11px] text-[#A5A1B8] leading-relaxed">
            <span className="text-[#E841A1] mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#E841A1]" />
            <span className="flex-1">{renderedLine}</span>
          </div>
        );
      }

      return (
        <p key={lineIdx} className={`${line.trim() === '' ? 'h-2' : 'my-1'} text-[11px] text-[#A5A1B8] leading-relaxed`}>
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] text-left" id="ask-her-ai-mentor-widget">
      {/* Hidden file selector */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt"
      />

      {/* Floating Widget Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-[2px] rounded-full focus:outline-none transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-pink-500/25"
        id="widget-trigger-btn"
      >
        {/* Glow & pulse background effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#E841A1] via-[#A144FF] to-[#1F1437] animate-pulse blur-[8px] opacity-75 group-hover:opacity-100 transition-opacity" />
        
        {/* Real Avatar Container */}
        <div className="relative w-14 h-14 rounded-full bg-[#0B0A11] flex items-center justify-center border border-[#A144FF]/25 text-white overflow-hidden">
          {isOpen ? (
            <X size={22} className="text-slate-200" />
          ) : (
            <div className="relative flex items-center justify-center w-full h-full">
              {/* Spinning gradient border */}
              <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-[#E841A1] to-[#A144FF] animate-spin opacity-40 blur-[1px] pointer-events-none" />
              <MessageSquare size={22} className="text-[#E841A1] animate-pulse relative z-10" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00FFA3] rounded-full border border-[#0B0F17] animate-ping" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#00FFA3] rounded-full border border-[#0B0F17]" />
            </div>
          )}
        </div>
      </button>

      {/* Expanded Glassmorphic Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute bottom-20 right-0 w-[360px] sm:w-[420px] max-h-[580px] bg-[#0B0A11]/90 backdrop-blur-2xl border border-[#A144FF]/15 rounded-2xl shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden"
            id="chat-modal-panel"
          >
            {/* Header section */}
            <div className="px-5 py-4 bg-slate-950/80 border-b border-[#A144FF]/10 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E841A1] via-[#A144FF] to-[#1F1437]" />
              
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#E841A1] to-[#A144FF] flex items-center justify-center border border-[#A144FF]/25 shadow-inner">
                  <Sparkles size={14} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white leading-none">
                    Dea AI Mentor
                  </h3>
                  <p className="text-[10px] text-[#E841A1] font-mono tracking-wide mt-1">
                    Your 24/7 STEM Career & Mentorship Guide
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-[#1F1437]/40 text-[#A5A1B8] hover:text-white transition-colors"
                title="Minimize chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Thread Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[350px] scrollbar-thin bg-slate-950/25"
            >
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'text-left'}`}
                  >
                    {/* Tiny avatar indicator */}
                    <div className={`w-6.5 h-6.5 rounded-full border flex-shrink-0 flex items-center justify-center mt-0.5 ${
                      isUser
                        ? 'bg-[#E841A1]/10 border border-[#E841A1]/20 text-[#E841A1]'
                        : 'bg-[#A144FF]/10 border border-[#A144FF]/20 text-[#A144FF]'
                    }`}>
                      {isUser ? <User size={11} /> : <Sparkles size={11} />}
                    </div>

                    {/* Chat Bubble */}
                    <div className={`rounded-xl p-3.5 text-xs relative ${
                      isUser
                        ? 'bg-[#A144FF]/15 border border-[#A144FF]/35 text-white rounded-tr-none shadow-md shadow-[#A144FF]/5'
                        : 'bg-[#1F1437]/35 border border-[#A144FF]/15 text-[#A5A1B8] rounded-tl-none shadow-md shadow-black/30'
                    }`}>
                      {/* Left glowing marker for AI response */}
                      {!isUser && (
                        <div className="absolute top-0 bottom-0 left-0 w-[3px] bg-gradient-to-b from-[#E841A1] to-[#A144FF] rounded-l" />
                      )}

                      <div className="text-left font-sans select-text">
                        {renderFormattedText(msg.content)}
                      </div>
                      <span className="block text-[8px] text-[#A5A1B8]/40 font-mono mt-1.5 tracking-wider uppercase text-right">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Loader */}
              {loading && (
                <div className="flex gap-2.5 max-w-[85%] text-left">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#A144FF]/10 border border-[#A144FF]/20 text-[#A144FF] flex items-center justify-center animate-spin">
                    <Sparkles size={11} />
                  </div>
                  <div className="rounded-xl p-3 bg-[#1F1437]/30 border border-[#A144FF]/10 rounded-tl-none text-[11px] text-[#A5A1B8] flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 bg-[#E841A1] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#A144FF] rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-[#A144FF] rounded-full animate-bounce delay-200" />
                    <span>Analyzing STEM query...</span>
                  </div>
                </div>
              )}

              {/* Listening Indicator with Soundwave Waves */}
              {isListening && (
                <div className="flex gap-2.5 max-w-[85%] text-left">
                  <div className="w-6.5 h-6.5 rounded-full bg-[#E841A1]/10 border border-[#E841A1]/20 text-[#E841A1] flex items-center justify-center animate-pulse">
                    <Mic size={11} />
                  </div>
                  <div className="rounded-xl p-3 bg-[#1F1437]/25 border border-[#E841A1]/15 rounded-tl-none text-[11px] text-[#A5A1B8] flex flex-col gap-2 shadow-md">
                    <span className="font-mono text-[9px] uppercase font-bold text-[#E841A1] animate-pulse">
                      Voice System Listening...
                    </span>
                    <div className="flex items-end gap-1 h-5 px-1 bg-black/20 rounded-lg py-1 justify-center">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-[#E841A1] rounded-full"
                          initial={{ height: 4 }}
                          animate={{ height: [6, 16, 4] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.5 + bar * 0.1,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt chips tray */}
            <div className="px-4 py-2 border-t border-white/5 bg-slate-950/40 text-left">
              <span className="text-[9px] uppercase font-bold text-[#A5A1B8]/60 tracking-wider font-mono block mb-1.5">
                Suggested Quick Mentoring Topics:
              </span>
              <div className="flex flex-col gap-1.5">
                {FLOATING_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip)}
                    disabled={loading || isListening}
                    className="w-full text-left text-[10px] text-[#A5A1B8] hover:text-white bg-[#1F1437]/15 hover:bg-[#1F1437]/35 border border-[#A144FF]/10 hover:border-[#A144FF]/30 px-3 py-1.5 rounded-lg transition-all truncate duration-100 disabled:opacity-50"
                  >
                    🚀 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Footer Input Section */}
            <div className="p-3 bg-slate-950/90 border-t border-[#A144FF]/10 space-y-2">
              {/* Attachment Pill Indicator */}
              {attachedFile && (
                <div className="flex items-center justify-between px-3 py-1 bg-[#A144FF]/10 border border-[#A144FF]/25 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-[#A144FF] truncate">
                    <FileText size={12} className="text-[#A144FF]" />
                    <span className="truncate font-mono text-[10px]">{attachedFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeAttachment}
                    className="p-0.5 rounded-full hover:bg-[#1F1437]/45 text-[#A5A1B8] hover:text-white"
                    title="Remove file"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              {/* Status Alert for File attached feedback */}
              {attachSuccess && (
                <div className="text-[10px] text-[#00FFA3] font-mono font-medium flex items-center gap-1">
                  <Check size={10} strokeWidth={3} />
                  <span>File successfully staged for resume evaluation</span>
                </div>
              )}

              {/* Input Form Controls */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                {/* File Attachment staging button */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={loading}
                  className={`p-2 rounded-xl transition-all border ${
                    attachedFile 
                      ? 'bg-[#A144FF]/15 border border-[#A144FF]/35 text-[#A144FF]' 
                      : 'bg-[#1F1437]/15 border border-[#A144FF]/10 text-[#A5A1B8] hover:text-white hover:bg-[#1F1437]/35'
                  }`}
                  title="Attach career resume (PDF/Word)"
                >
                  <Paperclip size={15} />
                </button>

                {/* Simulated Voice Input toggle */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  disabled={loading}
                  className={`p-2 rounded-xl transition-all border ${
                    isListening
                      ? 'bg-[#E841A1]/15 border border-[#E841A1]/35 text-[#E841A1] animate-pulse'
                      : 'bg-[#1F1437]/15 border border-[#A144FF]/10 text-[#A5A1B8] hover:text-white hover:bg-[#1F1437]/35'
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Use voice input"}
                >
                  <Mic size={15} />
                </button>

                {/* Primary text input */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading || isListening}
                    placeholder="Inquire or seek help..."
                    className="w-full pl-3 pr-8 py-2 bg-slate-950 border border-[#A144FF]/15 rounded-xl text-xs text-white focus:outline-none focus:border-[#A144FF] transition-all placeholder:text-[#A5A1B8]/40 disabled:opacity-50"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[9px] font-mono text-slate-600 hidden sm:inline-flex items-center gap-0.5 pointer-events-none">
                    <CornerDownLeft size={8} /> Enter
                  </span>
                </div>

                {/* Submit query button */}
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !attachedFile) || isListening}
                  className="p-2 bg-gradient-to-r from-[#E841A1] to-[#A144FF] text-white rounded-xl hover:opacity-95 active:scale-95 transition-all shadow-md shadow-[#A144FF]/10 disabled:opacity-50 disabled:active:scale-100 flex-shrink-0"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
