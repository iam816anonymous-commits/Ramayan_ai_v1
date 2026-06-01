'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './Timeline';
import SagePresence from './SagePresence';
import IntricateBorder from './IntricateBorder';
import SacredLamp from './SacredLamp';

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
}

interface EntityKnowledge {
  entity: string;
  description: string;
  relations: Array<{source: string, type: string, target: string}>;
}

const REVELATION_TIMINGS = {
  REFLECTION: 1.0,
  MEANING: 4.5,
  CONTEXT: 8.0,
  TAKEAWAY: 11.5,
  SOURCES: 15.0,
  TOTAL_DURATION: 25000
};

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sageState, setSageState] = useState<'idle' | 'thinking' | 'revealing' | 'speaking'>('idle');
  const [activeKanda, setActiveKanda] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityKnowledge | null>(null);
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
      if (data.meta?.kanda) {
        setActiveKanda(data.meta.kanda);
      }

      setMessages(prev => [...prev, {
        role: 'sage',
        revelation: data.revelation,
        meta: data.meta,
        agent: data.agent
      }]);

      setTimeout(() => setSageState('speaking'), REVELATION_TIMINGS.SOURCES * 1000);
      setTimeout(() => setSageState('idle'), REVELATION_TIMINGS.TOTAL_DURATION);
    } catch (_err) {
      setMessages(prev => [...prev, {
        role: 'sage',
        content: "The connection to the Sanctum has been interrupted. The silence remains unbroken."
      }]);
      setSageState('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleEntityClick = async (name: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/knowledge/${encodeURIComponent(name)}`);
      const data = await res.json();
      setSelectedEntity(data);
    } catch (err) {
      console.error("Failed to fetch entity knowledge", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#D4AF37] font-lora overflow-x-hidden selection:bg-[#D4AF37]/20 selection:text-[#FDFCF0]">
      <SagePresence state={sageState} />

      <div className="relative z-10 flex flex-col h-screen p-4 md:p-12">
        <header className="mb-12 md:mb-20 text-center relative pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl tracking-[0.4em] uppercase mb-4 font-cinzel font-light text-[#FDFCF0] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          >
            Sanctum
          </motion.h1>
          <div className="flex items-center justify-center space-x-4 opacity-40">
             <div className="w-12 h-[1px] bg-[#D4AF37]" />
             <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase font-light">The Eternal Knowledge Platform</p>
             <div className="w-12 h-[1px] bg-[#D4AF37]" />
          </div>
        </header>

        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto max-w-5xl mx-auto w-full space-y-24 scrollbar-hide pb-48 px-6"
        >
          <AnimatePresence mode='popLayout'>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-center mb-16' : 'items-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-[70%] text-center">
                    <span className="text-xl md:text-3xl opacity-50 font-light italic leading-relaxed text-[#FDFCF0]">
                      &ldquo;{msg.content}&rdquo;
                    </span>
                  </div>
                ) : (
                  <IntricateBorder className="w-full bg-[#080808]/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
                  <div className="w-full space-y-16 md:space-y-24 p-12 md:p-24">
                    {msg.revelation ? (
                      <>
                        <RevelationSection
                          title="Reflection"
                          body={msg.revelation.reflection}
                          delay={REVELATION_TIMINGS.REFLECTION}
                        />
                        <RevelationSection
                          title="The Meaning"
                          body={msg.revelation.meaning}
                          delay={REVELATION_TIMINGS.MEANING}
                        />
                        <RevelationSection
                          title="Divine Context"
                          body={msg.revelation.context}
                          delay={REVELATION_TIMINGS.CONTEXT}
                        />
                        <RevelationSection
                          title="Eternal Takeaway"
                          body={msg.revelation.takeaway}
                          delay={REVELATION_TIMINGS.TAKEAWAY}
                        />

                        <SourceAttribution
                          meta={msg.meta}
                          agent={msg.agent}
                          onEntityClick={handleEntityClick}
                          delay={REVELATION_TIMINGS.SOURCES}
                        />
                      </>
                    ) : (
                      <p className="text-xl md:text-2xl font-light opacity-80 text-[#FDFCF0] leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                  </IntricateBorder>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 space-y-8"
            >
              <SacredLamp />
              <span className="text-[10px] tracking-[0.5em] opacity-30 uppercase italic font-light">The Sage communes with the infinite...</span>
            </motion.div>
          )}
        </main>

        <footer className="fixed bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent z-20">
          <div className="max-w-5xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                placeholder={loading ? "Listen in silence..." : "Whisper your quest for truth..."}
                className="w-full bg-transparent border-b border-[#D4AF37]/10 py-8 px-6 focus:outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-[#D4AF37]/10 text-2xl md:text-4xl font-light tracking-wide disabled:opacity-30 text-[#FDFCF0]"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-6">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-1000 ${sageState === 'thinking' ? 'bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]' : 'bg-[#D4AF37]/5'}`} />
                <span className="hidden md:block text-[9px] tracking-[0.4em] opacity-10 uppercase font-light group-focus-within:opacity-30 transition-opacity">
                  Align with the One
                </span>
              </div>
            </form>
          </div>
        </footer>
      </div>

      <div className="relative z-10">
        <Timeline activeKanda={activeKanda} />
      </div>

      {/* Entity Knowledge Explorer Modal */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEntity(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-xl w-full bg-[#0d0d0d] border border-[#d4af37]/30 p-10 space-y-8 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

              <div className="space-y-2">
                <h2 className="text-[10px] uppercase tracking-[0.6em] opacity-40">Knowledge Explorer</h2>
                <h3 className="text-4xl font-light tracking-widest uppercase">{selectedEntity.entity}</h3>
              </div>

              <p className="text-xl font-light leading-relaxed opacity-80 text-[#eeeae0]">
                {selectedEntity.description}
              </p>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] opacity-40">Divine Relations</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedEntity.relations?.map((rel, idx) => (
                    <div key={idx} className="px-4 py-2 border border-[#d4af37]/10 bg-[#111] flex items-center space-x-3">
                      <span className="text-xs font-light">{rel.source}</span>
                      <span className="text-[9px] uppercase tracking-tighter opacity-30 italic">{rel.type.replace(/_/g, ' ')}</span>
                      <span className="text-xs font-light">{rel.target}</span>
                    </div>
                  ))}
                  {(!selectedEntity.relations || selectedEntity.relations.length === 0) && (
                    <span className="text-xs opacity-30 italic">No direct relations discovered yet.</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedEntity(null)}
                className="w-full py-4 border border-[#d4af37]/20 text-[10px] uppercase tracking-[0.4em] hover:bg-[#d4af37]/5 transition-colors mt-4"
              >
                Return to Sanctum
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RevelationSection = ({ title, body, delay }: { title: string, body: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay, duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
    className="space-y-8"
  >
    <div className="flex items-center space-x-4">
      <div className="w-8 h-[1px] bg-[#D4AF37]/30" />
      <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] font-medium opacity-60">{title}</h3>
    </div>
    <p className="text-xl md:text-5xl leading-[1.7] font-light text-[#FDFCF0] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] first-letter:text-6xl md:first-letter:text-8xl first-letter:font-cinzel first-letter:mr-3 first-letter:float-left first-letter:text-[#D4AF37]">
      {body}
    </p>
  </motion.div>
);

const SourceAttribution = ({ meta, agent, onEntityClick, delay }: { meta?: Meta, agent?: string, onEntityClick: (name: string) => void, delay: number }) => {
  if (!meta) return null;

  const allEntities = useMemo(() => [
    ...meta.entities.characters,
    ...meta.entities.locations,
    ...meta.entities.events
  ], [meta.entities]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 2 }}
      className="pt-16 mt-16 border-t border-[#D4AF37]/5 space-y-10"
    >
      <div className="flex flex-wrap gap-4">
        {allEntities.map((ent, idx) => (
          <button
            key={idx}
            onClick={() => onEntityClick(ent)}
            className="px-5 py-2 text-[10px] uppercase tracking-[0.3em] border border-[#D4AF37]/5 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5 transition-all opacity-30 hover:opacity-100 text-[#FDFCF0]"
          >
            {ent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-[10px] uppercase tracking-[0.3em] opacity-20 font-light">
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.5em]">Kanda</span>
          <span className="text-[#FDFCF0]">{meta.kanda || "Universal"}</span>
        </div>
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.5em]">Verses</span>
          <span className="text-[#FDFCF0]">{meta.verses.join(', ') || "Various"}</span>
        </div>
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.5em]">Sanctum Lineage</span>
          <span className="text-[#FDFCF0]">{meta.sources.join(', ')}</span>
        </div>
      </div>
      <div className="text-[8px] uppercase tracking-[0.6em] opacity-10 italic">
        Wisdom channeled via {agent}
      </div>
    </motion.div>
  );
};

export default SanctumChat;
