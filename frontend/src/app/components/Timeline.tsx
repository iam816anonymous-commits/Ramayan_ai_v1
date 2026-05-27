'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface KandaInfo {
  id: string;
  kanda: string;
  title: string;
  desc: string;
  theme: string;
}

const defaultEvents: KandaInfo[] = [
  { id: "Bala", kanda: "Bala Kanda", title: "The Divine Birth", desc: "The birth of Rama and his brothers in Ayodhya.", theme: "Innocence & Lineage" },
  { id: "Ayodhya", kanda: "Ayodhya Kanda", title: "The Great Exile", desc: "Rama departs for the forest to fulfill his father's promise.", theme: "Duty & Sacrifice" },
  { id: "Aranya", kanda: "Aranya Kanda", title: "The Forest Dwellers", desc: "Life in the Dandaka forest and the abduction of Sita.", theme: "Trial & Separation" },
  { id: "Kishkindha", kanda: "Kishkindha Kanda", title: "The Monkey Alliance", desc: "Rama meets Hanuman and alliances with Sugriva.", theme: "Friendship & Valor" },
  { id: "Sundara", kanda: "Sundara Kanda", title: "Hanuman's Leap", desc: "Hanuman crosses the ocean and finds Sita in Lanka.", theme: "Devotion & Hope" },
  { id: "Yuddha", kanda: "Yuddha Kanda", title: "The Great War", desc: "The battle against Ravana and the rescue of Sita.", theme: "Victory & Dharma" },
];

interface TimelineProps {
  activeKanda?: string | null;
}

const Timeline = ({ activeKanda }: TimelineProps) => {
  return (
    <div className="relative py-32 bg-[#050505] text-[#d4af37] border-t border-[#d4af37]/5 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center mb-24"
        >
          <h2 className="text-sm tracking-[0.6em] uppercase opacity-40 mb-4">Chronicles</h2>
          <h3 className="text-4xl md:text-5xl font-light tracking-widest uppercase">The Seven Kandas</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {defaultEvents.map((event, i) => {
            const isActive = activeKanda && (event.id.includes(activeKanda) || activeKanda.includes(event.id));

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group p-8 border transition-all duration-1000 cursor-pointer bg-[#080808] ${
                  isActive
                    ? 'border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.1)] scale-[1.02]'
                    : 'border-[#d4af37]/5 hover:border-[#d4af37]/20'
                }`}
              >
                <div className={`absolute inset-0 transition-colors duration-1000 ${
                  isActive ? 'bg-[#d4af37]/5' : 'bg-[#d4af37]/0 group-hover:bg-[#d4af37]/2'
                }`} />

                <div className="relative z-10">
                  <span className={`text-[10px] uppercase tracking-[0.3em] transition-opacity duration-1000 ${
                    isActive ? 'opacity-80' : 'opacity-40 group-hover:opacity-60'
                  }`}>
                    {event.kanda}
                  </span>
                  <h3 className={`text-2xl mb-4 font-light tracking-wide transition-colors duration-1000 ${
                    isActive ? 'text-[#eeeae0]' : 'group-hover:text-[#eeeae0]'
                  }`}>
                    {event.title}
                  </h3>
                  <p className={`text-sm leading-relaxed font-light mb-6 transition-opacity duration-1000 ${
                    isActive ? 'opacity-90' : 'opacity-50 group-hover:opacity-70'
                  }`}>
                    {event.desc}
                  </p>
                  <div className={`pt-4 border-t flex items-center justify-between transition-colors duration-1000 ${
                    isActive ? 'border-[#d4af37]/30' : 'border-[#d4af37]/10'
                  }`}>
                    <span className="text-[9px] uppercase tracking-widest opacity-30 italic">Theme</span>
                    <span className={`text-[10px] uppercase tracking-widest font-medium transition-opacity duration-1000 ${
                      isActive ? 'opacity-100' : 'opacity-60'
                    }`}>
                      {event.theme}
                    </span>
                  </div>
                </div>

                {/* Animated Corner Accents */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l transition-all duration-1000 ${
                  isActive ? 'border-[#d4af37]/60' : 'border-[#d4af37]/0 group-hover:border-[#d4af37]/30'
                }`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-all duration-1000 ${
                  isActive ? 'border-[#d4af37]/60' : 'border-[#d4af37]/0 group-hover:border-[#d4af37]/30'
                }`} />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-xs tracking-[0.3em] opacity-20 uppercase italic">Uttara Kanda | The Final Silence</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Timeline;
