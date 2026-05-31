'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface KandaInfo {
  id: string;
  kanda: string;
  title: string;
  summary: string;
  theme: string;
  events: string[];
  journey: string;
}

interface TimelineProps {
  activeKanda?: string | null;
}

const KANDAS: KandaInfo[] = [
  {
    "id": "Bala",
    "kanda": "Bala Kanda",
    "title": "The Divine Birth",
    "summary": "Focuses on the childhood of Rama and the early adventures with Sage Vishwamitra.",
    "theme": "Innocence & Lineage",
    "events": ["Birth of Rama", "Slaying of Tataka", "Breaking of Shiva's Bow", "Marriage to Sita"],
    "journey": "Ayodhya → Mithila"
  },
  {
    "id": "Ayodhya",
    "kanda": "Ayodhya Kanda",
    "title": "The Great Exile",
    "summary": "Describes the preparations for Rama's coronation and his eventual exile to the forest.",
    "theme": "Duty & Sacrifice",
    "events": ["Kaikeyi's Boon", "Dasharatha's Grief", "Rama's Departure", "Bharata's Meeting"],
    "journey": "Ayodhya → Chitrakoot"
  },
  {
    "id": "Aranya",
    "kanda": "Aranya Kanda",
    "title": "The Forest Dwellers",
    "summary": "Relates the life of Rama in the forest and the abduction of Sita by Ravana.",
    "theme": "Trial & Separation",
    "events": ["Slaying of Khara", "The Golden Deer", "Sita's Abduction", "Meeting Jatayu"],
    "journey": "Chitrakoot → Dandaka Forest"
  },
  {
    "id": "Kishkindha",
    "kanda": "Kishkindha Kanda",
    "title": "The Monkey Alliance",
    "summary": "Covers Rama's meeting with Hanuman and the alliance with the monkey king Sugriva.",
    "theme": "Friendship & Valor",
    "events": ["Meeting Hanuman", "Slaying of Vali", "Search for Sita Begins", "Sampati's Vision"],
    "journey": "Dandaka → Kishkindha"
  },
  {
    "id": "Sundara",
    "kanda": "Sundara Kanda",
    "title": "Hanuman's Leap",
    "summary": "The beautiful kanda focusing on Hanuman's journey to Lanka to find Sita.",
    "theme": "Devotion & Hope",
    "events": ["Leaping the Ocean", "Finding Sita", "Burning of Lanka", "Return to Rama"],
    "journey": "Kishkindha → Lanka"
  },
  {
    "id": "Yuddha",
    "kanda": "Yuddha Kanda",
    "title": "The Great War",
    "summary": "Describes the epic battle between Rama's forces and Ravana's army.",
    "theme": "Victory & Dharma",
    "events": ["Building the Bridge", "The Great Battle", "Fall of Ravana", "Rama's Coronation"],
    "journey": "Lanka → Ayodhya"
  }
];

const Timeline = ({ activeKanda }: TimelineProps) => {
  const kandas = KANDAS;
  const timelineRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  useEffect(() => {
    if (activeKanda) {
      const matchedKanda = kandas.find(event =>
        event.id.toLowerCase().includes(activeKanda.toLowerCase()) ||
        activeKanda.toLowerCase().includes(event.id.toLowerCase())
      );

      if (matchedKanda && timelineRefs.current[matchedKanda.id]) {
        timelineRefs.current[matchedKanda.id]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }, [activeKanda, kandas]);
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
          {kandas.map((event, i) => {
            const isActive = activeKanda && (
              event.id.toLowerCase().includes(activeKanda.toLowerCase()) ||
              activeKanda.toLowerCase().includes(event.id.toLowerCase())
            );

            return (
              <motion.div
                key={i}
                ref={el => { timelineRefs.current[event.id] = el; }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative group p-8 border transition-all duration-1000 cursor-pointer bg-[#080808] overflow-hidden ${
                  isActive
                    ? 'border-[#d4af37]/60 shadow-[0_0_30px_rgba(212,175,55,0.1)] scale-[1.02]'
                    : 'border-[#d4af37]/5 hover:border-[#d4af37]/20'
                }`}
              >
                <div className={`absolute inset-0 transition-colors duration-1000 ${
                  isActive ? 'bg-[#d4af37]/5' : 'bg-[#d4af37]/0 group-hover:bg-[#d4af37]/2'
                }`} />

                <div className="relative z-10 flex flex-col h-full">
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
                    {event.summary}
                  </p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t border-[#d4af37]/20"
                      >
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase tracking-widest opacity-30 italic block">Key Events</span>
                          <div className="flex flex-wrap gap-2">
                            {event.events.map((ev, idx) => (
                              <span key={idx} className="text-[9px] border border-[#d4af37]/20 px-2 py-0.5 bg-black/40">
                                {ev}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] uppercase tracking-widest opacity-30 italic">Journey</span>
                          <span className="text-[10px] font-medium">{event.journey}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-auto pt-4 border-t border-[#d4af37]/10 flex items-center justify-between transition-colors duration-1000">
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
