'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntricateBorder from './IntricateBorder';
import SacredLamp from './SacredLamp';
import SagePresence from './SagePresence';

interface Revelation {
  reflection: string;
  meaning: string;
  context: string;
  takeaway: string;
}

interface Meta {
  chunks_used: number;
  kanda?: string;
  entities: {
    characters: string[];
    locations: string[];
    events: string[];
  };
  verses: string[];
  sources: string[];
}

interface Message {
  role: 'user' | 'sage';
  content?: string;
  revelation?: Revelation;
  meta?: Meta;
  agent?: string;
  source_verse?: string;
}

const REVELATION_TIMINGS = {
  REFLECTION: 0.8,
  MEANING: 3.5,
  CONTEXT: 6.5,
  TAKEAWAY: 9.5,
  SOURCES: 12.5
};

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sageState, setSageState] = useState<'idle' | 'thinking' | 'revealing' | 'speaking'>('idle');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
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
        meta: data.meta,
        agent: data.agent,
        source_verse: data.source_verse
      }]);

      // Reset state after revelation completes roughly
      setTimeout(() => setSageState('idle'), 15000);
    } catch (_err) {
      setSageState('idle');
      setMessages(prev => [...prev, {
        role: 'sage',
        content: "The connection to the Sanctum has been interrupted. The silence remains unbroken."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full overflow-hidden flex flex-col items-center">
      {/* Sage is now part of the chat background to better react to state */}
      <div className="absolute inset-0 z-0">
        <SagePresence state={sageState} />
      </div>

      {/* Main Conversation Chamber */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full max-w-4xl h-full overflow-y-auto px-6 py-20 scrollbar-hide flex flex-col items-center"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-32 text-center space-y-8"
            >
              <h2 className="text-[12px] uppercase tracking-[1em] font-cinzel opacity-40">The Sanctum Awaits</h2>
              <p className="text-xl md:text-2xl font-light italic opacity-20 max-w-md mx-auto leading-relaxed">
                "Ask what weighs upon your heart, and the wisdom of the ages shall reveal its path."
              </p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="w-full mb-32 last:mb-64 flex flex-col items-center">
              {msg.role === 'user' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="text-center italic text-lg md:text-xl font-light py-12 max-w-2xl"
                >
                  &ldquo;{msg.content}&rdquo;
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full space-y-24"
                >
                  {msg.revelation ? (
                    <div className="space-y-24">
                      {/* Reflection Card */}
                      <div className="flex flex-col items-center space-y-6">
                        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent" />
                        <RevelationSection
                          title="Reflection"
                          body={msg.revelation.reflection}
                          delay={REVELATION_TIMINGS.REFLECTION}
                          center
                        />
                      </div>

                      {/* Main Meaning */}
                      <RevelationSection
                        title="Divine Meaning"
                        body={msg.revelation.meaning}
                        delay={REVELATION_TIMINGS.MEANING}
                        large
                        center
                      />

                      {/* Context & Takeaway */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full pt-12">
                        <RevelationSection
                          title="Scriptural Context"
                          body={msg.revelation.context}
                          delay={REVELATION_TIMINGS.CONTEXT}
                        />
                        <RevelationSection
                          title="Wisdom Takeaway"
                          body={msg.revelation.takeaway}
                          delay={REVELATION_TIMINGS.TAKEAWAY}
                        />
                      </div>

                      {/* Shloka */}
                      {msg.source_verse && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: REVELATION_TIMINGS.SOURCES, duration: 2.5 }}
                          className="pt-12 w-full"
                        >
                          <IntricateBorder className="bg-black/20 backdrop-blur-sm p-12 border-[#D4AF37]/5">
                            <p className="text-2xl md:text-4xl font-light text-[#D4AF37] leading-relaxed text-center italic font-serif opacity-90">
                              {msg.source_verse}
                            </p>
                          </IntricateBorder>
                          <SourceAttribution meta={msg.meta} delay={REVELATION_TIMINGS.SOURCES + 1} />
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xl md:text-2xl font-light opacity-80 text-[#FDFCF0] leading-relaxed text-center">
                      {msg.content}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              className="flex flex-col items-center space-y-8 py-20"
            >
              <SacredLamp />
              <p className="text-[10px] uppercase tracking-[0.5em] italic opacity-40">The Sage Contemplates...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Altar */}
      <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-6 flex justify-center">
        <div className="w-full max-w-2xl relative group">
          <div className="absolute inset-0 bg-[#D4AF37]/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />

          <form onSubmit={handleSubmit} className="relative bg-black/40 backdrop-blur-3xl border border-[#D4AF37]/10 rounded-full flex items-center p-2 group-focus-within:border-[#D4AF37]/40 group-focus-within:shadow-[0_0_50px_rgba(212,175,55,0.1)] transition-all duration-1000">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={loading}
              placeholder="Whisper your quest to the Sage..."
              className="flex-1 bg-transparent border-none px-10 py-5 focus:outline-none placeholder:text-[#D4AF37]/20 text-xl font-light text-[#FDFCF0] resize-none h-16 scrollbar-hide"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-12 h-12 rounded-full flex items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-all disabled:opacity-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>

          {messages.length === 0 && (
            <div className="mt-6 flex justify-center gap-6 opacity-30">
              {["Why Rama?", "The Bridge", "Sita's Faith"].map((s, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(s)}
                  className="text-[9px] uppercase tracking-[0.3em] hover:opacity-100 transition-all hover:text-[#D4AF37]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RevelationSection = ({ title, body, delay, large, center }: { title: string, body: string, delay: number, large?: boolean, center?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay, duration: 3, ease: [0.16, 1, 0.3, 1] }}
    className={`space-y-6 ${center ? 'text-center' : ''} w-full`}
  >
    <div className={`flex items-center space-x-4 ${center ? 'justify-center' : ''}`}>
      {!center && <div className="w-6 h-[1px] bg-[#D4AF37]/20" />}
      <h3 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] opacity-40 font-cinzel">{title}</h3>
      {!center && <div className="flex-1 h-[1px] bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />}
    </div>
    <p className={`
      ${large ? 'text-3xl md:text-5xl font-cinzel leading-tight text-glow' : 'text-xl md:text-2xl leading-relaxed'}
      font-light text-[#FDFCF0] opacity-90
    `}>
      {body}
    </p>
  </motion.div>
);

const SourceAttribution = ({ meta, delay }: { meta?: Meta, delay: number }) => {
  if (!meta) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 2 }}
      className="mt-12 flex flex-col items-center space-y-8"
    >
      <div className="flex flex-wrap justify-center gap-4 opacity-40">
        {[...meta.entities.characters, ...meta.entities.locations].map((ent, idx) => (
          <span key={idx} className="text-[9px] uppercase tracking-[0.2em] px-3 py-1 border border-[#D4AF37]/10 rounded-full">
            {ent}
          </span>
        ))}
      </div>

      <div className="flex gap-12 text-[9px] uppercase tracking-[0.4em] opacity-20 font-cinzel">
        <div className="flex flex-col items-center gap-1">
          <span className="opacity-40">Kanda</span>
          <span className="text-[#D4AF37]">{meta.kanda || "Universal"}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="opacity-40">Lineage</span>
          <span className="text-[#D4AF37]">{meta.sources[0]}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SanctumChat;
