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
    <div className="relative z-10 flex flex-col lg:flex-row h-[calc(100vh-8rem)] overflow-hidden mx-6 mb-6 border border-[#C9A86A]/10 bg-[#11100D]/20 backdrop-blur-sm rounded-lg shadow-2xl">

      {/* Left Panel: Query Panel */}
      <div className="w-full lg:w-1/3 flex flex-col border-r border-[#C9A86A]/5 bg-[#11100D]/40 backdrop-blur-md">
        <header className="p-10 border-b border-[#C9A86A]/5">
          <h2 className="text-[11px] uppercase tracking-[0.6em] text-[#E6CF9B] font-cinzel">The Offering Hall</h2>
        </header>

        {/* Query History */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide"
        >
          {messages.filter(m => m.role === 'user').map((msg, i) => (
            <button
              key={i}
              onClick={() => {
                // Find the corresponding sage response
                const sageIdx = messages.findIndex((m, idx) => idx > messages.indexOf(msg) && m.role === 'sage');
                if (sageIdx !== -1) setActiveMessageIndex(sageIdx);
              }}
              className={`w-full text-left p-8 border transition-all duration-700 ${
                activeMessageIndex !== null && messages.indexOf(msg) === activeMessageIndex - 1
                ? 'border-[#C9A86A]/40 bg-[#C9A86A]/5 text-[#F2EAD8] scale-[1.02]'
                : 'border-[#C9A86A]/5 opacity-30 hover:opacity-100 hover:border-[#C9A86A]/20'
              }`}
            >
              <p className="text-base font-cormorant italic leading-relaxed line-clamp-2">
                &ldquo;{msg.content}&rdquo;
              </p>
            </button>
          ))}

          {loading && (
            <div className="flex flex-col items-center py-12 space-y-6 opacity-40">
              <div className="animate-pulse">
                <SacredLamp />
              </div>
              <span className="text-[9px] tracking-[0.5em] uppercase font-cinzel text-[#E6CF9B]">Communing...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-10 border-t border-[#C9A86A]/5 bg-[#11100D]/30">
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C9A86A]/0 via-[#C9A86A]/10 to-[#C9A86A]/0 rounded-sm blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
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
                placeholder="Whisper your question to the Sage..."
                className="relative w-full bg-[#080705]/80 border border-[#C9A86A]/10 p-8 rounded-sm focus:outline-none focus:border-[#C9A86A]/40 transition-all placeholder:text-[#C9A86A]/20 text-xl font-cormorant italic font-light disabled:opacity-30 text-[#F2EAD8] resize-none h-40 shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full py-5 bg-[#C9A86A]/5 border border-[#C9A86A]/20 text-[11px] uppercase tracking-[0.6em] font-cinzel hover:bg-[#C9A86A]/10 hover:border-[#C9A86A]/40 transition-all disabled:opacity-10 text-[#E6CF9B]"
              aria-label="Seek Wisdom from the Sage"
            >
              Seek Wisdom
            </button>
          </form>

          <div className="mt-10 flex flex-wrap gap-4">
            {["Why did Rama go to exile?", "The role of Hanuman", "Lessons on Dharma"].map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="text-left text-[9px] uppercase tracking-[0.3em] font-cinzel opacity-30 hover:opacity-100 hover:text-[#E6CF9B] transition-all border-b border-transparent hover:border-[#C9A86A]/20 pb-1"
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
        className="w-full lg:w-2/3 flex flex-col bg-[#080705]/40 backdrop-blur-xl overflow-y-auto scroll-smooth"
      >
        <header className="p-10 border-b border-[#C9A86A]/5 sticky top-0 bg-[#080705]/90 backdrop-blur-md z-10 flex justify-between items-center">
          <h2 className="text-[11px] uppercase tracking-[0.6em] text-[#E6CF9B] font-cinzel">The Revelation</h2>
          {activeMessage?.agent && (
            <span className="text-[9px] tracking-[0.4em] opacity-40 font-cinzel uppercase text-[#C9A86A]">
              {activeMessage.agent}
            </span>
          )}
        </header>

        <div className="flex-1 p-10 lg:p-24">
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: REVELATION_TIMINGS.SOURCES, duration: 2 }}
                        className="space-y-10"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="w-12 h-[1px] bg-[#C9A86A]/20" />
                            <h3 className="text-[10px] uppercase tracking-[0.8em] text-[#C9A86A] font-cinzel opacity-60">Sacred Script</h3>
                          </div>
                          <button
                            onClick={handleCopy}
                            className="p-3 text-[#C9A86A] opacity-30 hover:opacity-100 hover:bg-[#C9A86A]/5 transition-all focus-visible:ring-1 focus-visible:ring-[#C9A86A]/50 rounded-full outline-none"
                            aria-label="Preserve Shloka"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                        </div>
                        <IntricateBorder className="bg-[#11100D]/40 p-12 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86A]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                          <p className="text-3xl md:text-5xl font-cormorant text-[#E6CF9B] leading-relaxed text-center italic">
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
    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay, duration: 2, ease: [0.16, 1, 0.3, 1] }}
    className="space-y-8"
  >
    <div className="flex items-center space-x-6">
      <div className="w-10 h-[1px] bg-[#C9A86A]/20" />
      <h3 className="text-[9px] uppercase tracking-[0.6em] text-[#E6CF9B] font-cinzel opacity-40">{title}</h3>
    </div>
    <p className={`${large ? 'text-3xl md:text-5xl font-cormorant italic' : 'text-xl md:text-2xl font-inter'} leading-relaxed font-light text-[#F2EAD8] opacity-90`}>
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
      className="pt-16 border-t border-[#C9A86A]/10 space-y-12"
    >
      <div className="flex flex-wrap gap-4">
        {allEntities.map((ent, idx) => (
          <button
            key={idx}
            onClick={() => onEntityClick(ent)}
            className="px-5 py-2.5 text-[9px] uppercase tracking-[0.3em] font-cinzel border border-[#C9A86A]/10 bg-[#C9A86A]/5 hover:border-[#C9A86A]/40 transition-all text-[#F2EAD8] opacity-50 hover:opacity-100 rounded-sm"
            aria-label={`View knowledge for ${ent}`}
          >
            {ent}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-[10px] uppercase tracking-[0.4em] font-cinzel opacity-40">
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.6em]">Kanda</span>
          <span className="text-[#E6CF9B]">{meta.kanda || "Universal"}</span>
        </div>
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.6em]">Verses</span>
          <span className="text-[#E6CF9B]">{meta.verses.join(', ') || "Various"}</span>
        </div>
        <div className="space-y-2">
          <span className="block opacity-40 text-[8px] tracking-[0.6em]">Lineage</span>
          <span className="text-[#E6CF9B]">{meta.sources.join(', ')}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SanctumChat;
