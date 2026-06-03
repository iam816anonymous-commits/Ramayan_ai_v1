'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
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
  source_verse?: string;
}

interface EntityKnowledge {
  entity: string;
  description: string;
  relations: Array<{source: string, type: string, target: string}>;
}

const REVELATION_TIMINGS = {
  REFLECTION: 0.5,
  MEANING: 2.5,
  CONTEXT: 4.5,
  TAKEAWAY: 6.5,
  SOURCES: 8.5
};

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState<number | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<EntityKnowledge | null>(null);
  const [copied, setCopied] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the query list
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Auto-scroll to answer panel on new response
  useEffect(() => {
    if (activeMessageIndex !== null && answerRef.current) {
      answerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessageIndex]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/sanctum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      const data = await res.json();

      const sageMsgIndex = messages.length + 1;
      setMessages(prev => [...prev, {
        role: 'sage',
        revelation: data.revelation,
        meta: data.meta,
        agent: data.agent,
        source_verse: data.source_verse
      }]);
      setActiveMessageIndex(sageMsgIndex);
    } catch {
      setMessages(prev => [...prev, {
        role: 'sage',
        content: "The connection to the Sanctum has been interrupted. The silence remains unbroken."
      }]);
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

  const handleCopy = () => {
    if (activeMessage?.source_verse) {
      navigator.clipboard.writeText(activeMessage.source_verse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeMessage = activeMessageIndex !== null ? messages[activeMessageIndex] : null;

  return (
    <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-6rem)] overflow-hidden">

      {/* Left Panel: Query Panel */}
      <div className="w-full lg:w-1/3 flex flex-col border-r border-[#D4AF37]/5 bg-[#050505]/40 backdrop-blur-md">
        <header className="p-8 border-b border-[#D4AF37]/5">
          <h2 className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-cinzel font-light">Quest Panel</h2>
        </header>

        {/* Query History */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide"
        >
          {messages.filter(m => m.role === 'user').map((msg, i) => (
            <button
              key={i}
              onClick={() => {
                // Find the corresponding sage response
                const sageIdx = messages.findIndex((m, idx) => idx > messages.indexOf(msg) && m.role === 'sage');
                if (sageIdx !== -1) setActiveMessageIndex(sageIdx);
              }}
              className={`w-full text-left p-6 border transition-all ${
                activeMessageIndex !== null && messages.indexOf(msg) === activeMessageIndex - 1
                ? 'border-[#D4AF37]/40 bg-[#D4AF37]/5 text-[#FDFCF0]'
                : 'border-[#D4AF37]/5 opacity-40 hover:opacity-100 hover:border-[#D4AF37]/20'
              }`}
            >
              <p className="text-sm font-light italic leading-relaxed line-clamp-2">
                &ldquo;{msg.content}&rdquo;
              </p>
            </button>
          ))}

          {loading && (
            <div className="flex flex-col items-center py-12 space-y-4 opacity-30">
              <SacredLamp />
              <span className="text-[8px] tracking-[0.3em] uppercase italic">Communing...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-8 border-t border-[#D4AF37]/5">
          <form onSubmit={handleSubmit} className="relative">
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
              placeholder="Whisper your quest..."
              className="w-full bg-[#111] border border-[#D4AF37]/10 p-6 rounded-sm focus:outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-[#D4AF37]/20 text-lg font-light disabled:opacity-30 text-[#FDFCF0] resize-none h-32"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="mt-4 w-full py-4 bg-[#D4AF37]/5 border border-[#D4AF37]/20 text-[10px] uppercase tracking-[0.4em] hover:bg-[#D4AF37]/10 transition-all disabled:opacity-10"
              aria-label="Submit query to the Sage"
            >
              Ask the Sage
            </button>
          </form>

          <div className="mt-8 grid grid-cols-1 gap-2">
            {["Why did Rama go to exile?", "The role of Hanuman", "Lessons on Dharma"].map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="text-left text-[9px] uppercase tracking-[0.2em] opacity-30 hover:opacity-60 transition-opacity"
                aria-label={`Ask suggested query: ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel: Answer Sanctum */}
      <div
        ref={answerRef}
        className="w-full lg:w-2/3 flex flex-col bg-[#050505]/60 backdrop-blur-xl overflow-y-auto scroll-smooth"
      >
        <header className="p-8 border-b border-[#D4AF37]/5 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-10 flex justify-between items-center">
          <h2 className="text-[10px] uppercase tracking-[0.5em] opacity-40 font-cinzel font-light">Answer Sanctum</h2>
          {activeMessage?.agent && (
            <span className="text-[8px] tracking-[0.3em] opacity-20 italic">
              {activeMessage.agent}
            </span>
          )}
        </header>

        <div className="flex-1 p-8 lg:p-20">
          <AnimatePresence mode="wait">
            {activeMessage ? (
              <motion.div
                key={activeMessageIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-4xl mx-auto space-y-20 pb-20"
              >
                {activeMessage.revelation ? (
                  <>
                    <RevelationSection
                      title="Reflection"
                      body={activeMessage.revelation.reflection}
                      delay={REVELATION_TIMINGS.REFLECTION}
                    />

                    <div className="space-y-12">
                      <RevelationSection
                        title="Meaning"
                        body={activeMessage.revelation.meaning}
                        delay={REVELATION_TIMINGS.MEANING}
                        large
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <RevelationSection
                          title="Context"
                          body={activeMessage.revelation.context}
                          delay={REVELATION_TIMINGS.CONTEXT}
                        />
                        <RevelationSection
                          title="Takeaway"
                          body={activeMessage.revelation.takeaway}
                          delay={REVELATION_TIMINGS.TAKEAWAY}
                        />
                      </div>
                    </div>

                    {/* Supporting Shlokas Section */}
                    {activeMessage.source_verse && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: REVELATION_TIMINGS.SOURCES, duration: 2 }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-[1px] bg-[#D4AF37]/30" />
                            <h3 className="text-[9px] uppercase tracking-[0.6em] text-[#D4AF37] font-medium opacity-60">Sacred Shloka</h3>
                          </div>
                          <button
                            onClick={handleCopy}
                            className="p-2 text-[#D4AF37] opacity-40 hover:opacity-100 transition-all focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50 rounded-sm outline-none"
                            aria-label="Copy shloka to clipboard"
                          >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                        <IntricateBorder className="bg-[#111]/40 p-10">
                          <p className="text-2xl md:text-3xl font-light text-[#D4AF37] leading-relaxed text-center italic font-serif">
                            {activeMessage.source_verse}
                          </p>
                        </IntricateBorder>
                      </motion.div>
                    )}

                    <SourceAttribution
                      meta={activeMessage.meta}
                      onEntityClick={handleEntityClick}
                      delay={REVELATION_TIMINGS.SOURCES}
                    />
                  </>
                ) : (
                  <p className="text-xl md:text-2xl font-light opacity-80 text-[#FDFCF0] leading-relaxed text-center py-20">
                    {activeMessage.content}
                  </p>
                )}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-10">
                 <h3 className="text-xl uppercase tracking-[1em] font-cinzel">The Sanctum Awaits</h3>
                 <p className="text-sm tracking-widest italic">Submit your query to awaken the Sage</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Entity Knowledge Explorer Modal */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
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
              <h3 className="text-4xl font-light tracking-widest uppercase">{selectedEntity.entity}</h3>
              <p className="text-xl font-light leading-relaxed opacity-80 text-[#eeeae0]">{selectedEntity.description}</p>
              <button
                onClick={() => setSelectedEntity(null)}
                className="w-full py-4 border border-[#d4af37]/20 text-[10px] uppercase tracking-[0.4em] hover:bg-[#d4af37]/5 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RevelationSection = ({ title, body, delay, large }: { title: string, body: string, delay: number, large?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
    className="space-y-6"
  >
    <div className="flex items-center space-x-4">
      <div className="w-6 h-[1px] bg-[#D4AF37]/20" />
      <h3 className="text-[8px] uppercase tracking-[0.4em] text-[#D4AF37] opacity-40">{title}</h3>
    </div>
    <p className={`${large ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'} leading-relaxed font-light text-[#FDFCF0] opacity-90`}>
      {body}
    </p>
  </motion.div>
);

const SourceAttribution = ({ meta, onEntityClick, delay }: { meta?: Meta, onEntityClick: (name: string) => void, delay: number }) => {
  if (!meta) return null;

  const allEntities = [...meta.entities.characters, ...meta.entities.locations];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 2 }}
      className="pt-16 border-t border-[#D4AF37]/5 space-y-12"
    >
      <div className="flex flex-wrap gap-4">
        {allEntities.map((ent, idx) => (
          <button
            key={idx}
            onClick={() => onEntityClick(ent)}
            className="px-4 py-2 text-[8px] uppercase tracking-[0.2em] border border-[#D4AF37]/10 hover:border-[#D4AF37]/40 transition-all text-[#FDFCF0] opacity-40 hover:opacity-100"
            aria-label={`View knowledge for ${ent}`}
          >
            {ent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[9px] uppercase tracking-[0.3em] opacity-30">
        <div>
          <span className="block opacity-40 mb-1">Kanda</span>
          {meta.kanda || "Universal"}
        </div>
        <div>
          <span className="block opacity-40 mb-1">Verses</span>
          {meta.verses.join(', ') || "Various"}
        </div>
        <div>
          <span className="block opacity-40 mb-1">Lineage</span>
          {meta.sources.join(', ')}
        </div>
      </div>
    </motion.div>
  );
};

export default SanctumChat;
