'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Revelation {
  reflection: string;
  meaning: string;
  context: string;
  takeaway: string;
}

interface Message {
  role: 'user' | 'sage';
  content?: string;
  revelation?: Revelation;
  agent?: string;
}

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sageState, setSageState] = useState<'idle' | 'thinking' | 'revealing'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);
    setSageState('thinking');

    try {
      const res = await fetch('http://localhost:8000/api/sanctum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      const data = await res.json();

      setSageState('revealing');
      setMessages(prev => [...prev, {
        role: 'sage',
        revelation: data.revelation,
        agent: data.agent
      }]);
    } catch (_err) {
      setMessages(prev => [...prev, {
        role: 'sage',
        content: "The connection to the Sanctum has been interrupted. The silence remains unbroken."
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => setSageState('idle'), 2000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#d4af37] font-serif p-4 md:p-8 overflow-hidden">
      {/* Sage Aura Background Effect */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-2000 ${sageState === 'thinking' ? 'opacity-20' : sageState === 'revealing' ? 'opacity-30' : 'opacity-10'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37] rounded-full blur-[120px] mix-blend-screen animate-pulse" />
      </div>

      <header className="relative z-10 mb-8 md:mb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl tracking-[0.3em] uppercase mb-2 font-light"
        >
          Sanctum
        </motion.h1>
        <p className="text-[10px] md:text-xs tracking-[0.2em] opacity-40 uppercase">V1 | Divine Intelligence</p>
      </header>

      <main
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto max-w-3xl mx-auto w-full space-y-16 scrollbar-hide pb-32 px-4"
      >
        <AnimatePresence mode='popLayout'>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[80%]">
                  <span className="text-lg md:text-xl opacity-60 font-light italic leading-relaxed text-right block">
                    &ldquo;{msg.content}&rdquo;
                  </span>
                </div>
              ) : (
                <div className="w-full space-y-12 border-l border-[#d4af37]/20 pl-6 md:pl-10 py-4">
                  {msg.revelation ? (
                    <>
                      <RevelationSection
                        title="Reflection"
                        body={msg.revelation.reflection}
                        delay={0.5}
                      />
                      <RevelationSection
                        title="Meaning"
                        body={msg.revelation.meaning}
                        delay={2.5}
                      />
                      <RevelationSection
                        title="Context"
                        body={msg.revelation.context}
                        delay={4.5}
                      />
                      <RevelationSection
                        title="Takeaway"
                        body={msg.revelation.takeaway}
                        delay={6.5}
                      />
                    </>
                  ) : (
                    <p className="text-lg opacity-80">{msg.content}</p>
                  )}
                  {msg.agent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 8 }}
                      className="text-[10px] uppercase tracking-widest opacity-20 pt-4"
                    >
                      Revealed by {msg.agent}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-start space-y-4 border-l border-[#d4af37]/10 pl-10"
          >
            <div className="flex space-x-2">
              <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-[#d4af37] rounded-full animate-bounce" />
            </div>
            <span className="text-xs tracking-[0.2em] opacity-20 uppercase italic">The Sage is contemplating...</span>
          </motion.div>
        )}
      </main>

      <footer className="relative z-20 mt-auto pt-8 pb-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent max-w-3xl mx-auto w-full px-4">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            placeholder={loading ? "The Sage is speaking..." : "Whisper your query..."}
            className="w-full bg-transparent border-b border-[#d4af37]/20 py-6 px-4 focus:outline-none focus:border-[#d4af37]/60 transition-all placeholder:text-[#d4af37]/20 text-xl md:text-2xl font-light tracking-wide disabled:opacity-50"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-4">
            <div className={`w-2 h-2 rounded-full transition-colors duration-1000 ${sageState === 'thinking' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-[#d4af37]/20'}`} />
            <span className="hidden md:block text-[10px] tracking-[0.3em] opacity-20 uppercase font-light">
              Press Enter
            </span>
          </div>
        </form>
      </footer>
    </div>
  );
};

const RevelationSection = ({ title, body, delay }: { title: string, body: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 2, ease: "easeOut" }}
    className="space-y-3"
  >
    <h3 className="text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-30 font-medium">{title}</h3>
    <p className="text-lg md:text-2xl leading-relaxed font-light opacity-90 text-[#eeeae0] drop-shadow-sm">
      {body}
    </p>
  </motion.div>
);

export default SanctumChat;
