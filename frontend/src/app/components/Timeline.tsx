'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface KandaInfo {
  kanda: string;
  title: string;
  desc: string;
  theme: string;
}

const defaultEvents: KandaInfo[] = [
  { kanda: "Bala Kanda", title: "The Divine Birth", desc: "The birth of Rama and his brothers in Ayodhya.", theme: "Innocence & Lineage" },
  { kanda: "Ayodhya Kanda", title: "The Great Exile", desc: "Rama departs for the forest to fulfill his father's promise.", theme: "Duty & Sacrifice" },
  { kanda: "Aranya Kanda", title: "The Forest Dwellers", desc: "Life in the Dandaka forest and the abduction of Sita.", theme: "Trial & Separation" },
  { kanda: "Kishkindha Kanda", title: "The Monkey Alliance", desc: "Rama meets Hanuman and alliances with Sugriva.", theme: "Friendship & Valor" },
  { kanda: "Sundara Kanda", title: "Hanuman's Leap", desc: "Hanuman crosses the ocean and finds Sita in Lanka.", theme: "Devotion & Hope" },
  { kanda: "Yuddha Kanda", title: "The Great War", desc: "The battle against Ravana and the rescue of Sita.", theme: "Victory & Dharma" },
];

const Timeline = () => {
  return (
    <div className="relative py-32 bg-[#050505] text-[#d4af37] border-t border-[#d4af37]/5 overflow-hidden">
      {/* Decorative background elements */}
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
          {defaultEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-8 border border-[#d4af37]/5 hover:border-[#d4af37]/20 transition-all duration-700 cursor-pointer bg-[#080808]"
            >
              <div className="absolute inset-0 bg-[#d4af37]/0 group-hover:bg-[#d4af37]/2 transition-colors duration-700" />

              <div className="relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4 block group-hover:opacity-60 transition-opacity">
                  {event.kanda}
                </span>
                <h3 className="text-2xl mb-4 font-light tracking-wide group-hover:text-[#eeeae0] transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm opacity-50 leading-relaxed font-light mb-6 group-hover:opacity-70 transition-opacity">
                  {event.desc}
                </p>
                <div className="pt-4 border-t border-[#d4af37]/10 flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-widest opacity-30 italic">Theme</span>
                  <span className="text-[10px] uppercase tracking-widest opacity-60 font-medium">{event.theme}</span>
                </div>
              </div>

              {/* Animated Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#d4af37]/0 group-hover:border-[#d4af37]/30 transition-all duration-700" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#d4af37]/0 group-hover:border-[#d4af37]/30 transition-all duration-700" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-24 text-center"
        >
          <p className="text-xs tracking-[0.3em] opacity-20 uppercase italic">Uttara Kanda | The Final Silence</p>
        </motion.div>
      </div>

      {/* Subtle floating particles effect could be added here in V2 */}
    </div>
  );
};

export default Timeline;
