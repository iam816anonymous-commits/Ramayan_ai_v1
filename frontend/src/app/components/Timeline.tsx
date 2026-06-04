'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KandaInfo {
  id: string;
  kanda: string;
  title: string;
  summary: string;
  theme: string;
  events: string[];
  journey: string;
  atmosphere: string;
  color: string;
  sanskrit: string;
}

const Timeline = () => {
  const [activeKanda, setActiveKanda] = useState<string | null>(null);
  const [kandas, setKandas] = useState<KandaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/timeline');
        if (response.ok) {
          const data = await response.json();
          setKandas(data);
        }
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) return null;

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050505] overflow-hidden selection:bg-[#D4AF37]/30">
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {activeKanda && (
            <motion.div
              key={activeKanda}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
              className={`absolute inset-0 bg-gradient-to-b ${kandas.find(k => k.id === activeKanda)?.color} to-transparent opacity-40`}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[url('/textures/stone-grain.png')] opacity-10" />
      </div>

      <div className="relative z-10">
        <div className="h-screen flex flex-col items-center justify-center text-center px-10">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[12px] uppercase font-cinzel text-[#D4AF37] block mb-10 tracking-[1em]"
          >
            The Sacred Geography
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="text-5xl md:text-[8rem] font-cinzel tracking-widest uppercase text-[#F2EAD8]"
          >
            The Pilgrimage
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="w-48 h-[1px] bg-[#D4AF37]/30 mt-20"
          />
          <p className="mt-20 text-xl md:text-2xl font-cormorant italic text-[#B7AA92] max-w-2xl mx-auto opacity-60">
            Scroll to walk the path of the avatar, from the golden palaces of Ayodhya to the final victory in Lanka.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-10 pb-96 space-y-[40vh]">
          {kandas.map((kanda, idx) => (
            <motion.div
              key={kanda.id}
              onViewportEnter={() => setActiveKanda(kanda.id)}
              className={`relative flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-20 md:gap-40`}
            >
              <div className="w-full md:w-1/2 group">
                <div className={`relative aspect-[4/5] md:aspect-square overflow-hidden border border-[#D4AF37]/10 bg-[#11100D]/40 backdrop-blur-md transition-all duration-1000 group-hover:border-[#D4AF37]/30`}>
                  <div className="absolute top-8 left-8 text-8xl font-serif text-[#D4AF37]/5 select-none transition-all duration-1000 group-hover:text-[#D4AF37]/10">
                    {kanda.sanskrit}
                  </div>

                  <div className="absolute inset-0 p-12 flex flex-col justify-end">
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      className="text-[10px] tracking-[0.5em] text-[#D4AF37] font-cinzel uppercase mb-6"
                    >
                      {kanda.atmosphere}
                    </motion.span>
                    <h3 className="text-4xl md:text-6xl font-cinzel tracking-widest uppercase text-[#F2EAD8] mb-10">
                      {kanda.kanda}
                    </h3>
                    <p className="text-xl md:text-2xl font-cormorant italic text-[#B7AA92] leading-relaxed mb-12">
                      {kanda.summary}
                    </p>

                    <div className="flex items-center gap-4 text-[9px] tracking-[0.4em] font-cinzel text-[#D4AF37]/40">
                      <span>{kanda.journey}</span>
                      <div className="w-8 h-[1px] bg-[#D4AF37]/20" />
                      <span>{kanda.theme}</span>
                    </div>
                  </div>

                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                    <div className="w-full h-full border-t border-r border-[#D4AF37] translate-x-1/2 -translate-y-1/2 rotate-45" />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-16">
                <div className="space-y-6">
                   <h4 className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/60 font-cinzel">Key Milestones</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {kanda.events.map((event, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-6 border border-[#D4AF37]/5 bg-[#11100D]/20 hover:border-[#D4AF37]/20 transition-all"
                        >
                          <span className="text-[10px] uppercase tracking-[0.3em] font-cinzel text-[#E6CF9B]">{event}</span>
                        </motion.div>
                      ))}
                   </div>
                </div>

                <div className="pt-10 border-t border-[#D4AF37]/10">
                  <span className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel block mb-6">Sacred Essence</span>
                  <p className="text-3xl md:text-4xl font-cormorant italic text-[#F2EAD8]/80 leading-snug">
                    &ldquo;Every step in the {kanda.kanda} is a lesson in {kanda.theme.split(' & ')[0]}.&rdquo;
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-[20vh] left-1/2 -translate-x-1/2 w-[1px] h-[20vh] bg-gradient-to-b from-[#D4AF37]/20 to-transparent hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeKanda && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-12 right-12 z-50 text-right hidden lg:block"
          >
            <span className="text-[10px] uppercase tracking-[1em] text-[#D4AF37]/40 font-cinzel block">Currently Traversed</span>
            <span className="text-3xl font-cinzel tracking-widest text-[#F2EAD8] uppercase">
              {kandas.find(k => k.id === activeKanda)?.kanda}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
