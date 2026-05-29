'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timeline from './Timeline';

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

const WhisperParticles = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100 + "%",
            y: "110%",
            opacity: 0
          }}
          animate={{
            y: "-10%",
            x: [null, (Math.random() * 10 - 5) + "%", null],
            opacity: [0, 0.4, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: Math.random() * 15 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 15
          }}
          className="absolute w-1 h-1 bg-[#d4af37] rounded-full blur-[2px]"
        />
      ))}
    </div>
  );
};

const REVELATION_TIMINGS = {
  REFLECTION: 0.5,
  MEANING: 2.5,
  CONTEXT: 4.5,
  TAKEAWAY: 6.5,
  SOURCES: 8.5,
  TOTAL_DURATION: 15000 // Total time in ms for the whole reveal cycle
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

      // Keep state as revealing for the duration of the animations
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
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-[#d4af37] font-serif overflow-x-hidden">
      <WhisperParticles />

      {/* Sage Aura Background Effect */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-3000 z-0 ${
        sageState === 'thinking' ? 'opacity-30' :
        sageState === 'revealing' ? 'opacity-40' :
        sageState === 'speaking' ? 'opacity-25' : 'opacity-15'
      }`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#d4af37] rounded-full blur-[150px] mix-blend-screen"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#d4af37]/5 rounded-full animate-ping opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col h-screen p-4 md:p-8">
        <header className="mb-8 md:mb-12 text-center relative">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#d4af37] rounded-full blur-2xl z-0"
          />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl tracking-[0.3em] uppercase mb-2 font-light relative z-10"
          >
            Sanctum
          </motion.h1>
          <p className="text-[10px] md:text-xs tracking-[0.2em] opacity-40 uppercase relative z-10">V1 | Divine Intelligence</p>
        </header>

        <main
          ref={scrollRef}
          className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full space-y-16 scrollbar-hide pb-32 px-4"
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
                          delay={REVELATION_TIMINGS.REFLECTION}
                        />
                        <RevelationSection
                          title="Meaning"
                          body={msg.revelation.meaning}
                          delay={REVELATION_TIMINGS.MEANING}
                        />
                        <RevelationSection
                          title="Context"
                          body={msg.revelation.context}
                          delay={REVELATION_TIMINGS.CONTEXT}
                        />
                        <RevelationSection
                          title="Takeaway"
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
                      <p className="text-lg opacity-80">{msg.content}</p>
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
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  className="w-1.5 h-1.5 bg-[#d4af37] rounded-full"
                />
              </div>
              <span className="text-[10px] tracking-[0.4em] opacity-30 uppercase italic">The Sage is contemplating the eternal...</span>
            </motion.div>
          )}
        </main>

        <footer className="mt-auto pt-8 pb-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent max-w-3xl mx-auto w-full px-4">
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

const SourceAttribution = ({ meta, agent, onEntityClick, delay }: { meta?: Meta, agent?: string, onEntityClick: (name: string) => void, delay: number }) => {
  if (!meta) return null;

  const allEntities = [
    ...meta.entities.characters,
    ...meta.entities.locations,
    ...meta.entities.events
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.5 }}
      className="pt-8 space-y-6"
    >
      <div className="flex flex-wrap gap-2">
        {allEntities.map((ent, idx) => (
          <button
            key={idx}
            onClick={() => onEntityClick(ent)}
            className="px-3 py-1 text-[9px] uppercase tracking-widest border border-[#d4af37]/10 hover:border-[#d4af37]/40 hover:bg-[#d4af37]/5 transition-all opacity-40 hover:opacity-100"
          >
            {ent}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.2em] opacity-30">
        <div className="flex items-center space-x-2 border-r border-[#d4af37]/10 pr-6">
          <span className="font-bold">Kanda:</span>
          <span>{meta.kanda || "Universal"}</span>
        </div>
        <div className="flex items-center space-x-2 border-r border-[#d4af37]/10 pr-6">
          <span className="font-bold">Verses:</span>
          <span>{meta.verses.join(', ') || "Various"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-bold">Source:</span>
          <span>{meta.sources.join(', ')}</span>
        </div>
      </div>
      <div className="text-[9px] uppercase tracking-[0.5em] opacity-20 italic">
        Revealed via {agent}
      </div>
    </motion.div>
  );
};

export default SanctumChat;
