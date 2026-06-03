'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
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

interface Path {
  id: string;
  name: string;
  description: string;
  kandas: string[]; // List of kanda IDs involved in this path
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

const PATHS: Path[] = [
  {
    id: 'full',
    name: 'Complete Ramayana',
    description: 'The full journey of Dharma from birth to coronation.',
    kandas: ['Bala', 'Ayodhya', 'Aranya', 'Kishkindha', 'Sundara', 'Yuddha']
  },
  {
    id: 'exile',
    name: "Rama's Exile",
    description: "The path of duty following Dasharatha's command.",
    kandas: ['Ayodhya', 'Aranya']
  },
  {
    id: 'hanuman',
    name: "Hanuman's Mission",
    description: "The journey of devotion and the search for Sita.",
    kandas: ['Kishkindha', 'Sundara']
  },
  {
    id: 'war',
    name: 'The Great War',
    description: 'The final struggle between Dharma and Adharma.',
    kandas: ['Sundara', 'Yuddha']
  }
];

const Timeline = ({ activeKanda }: { activeKanda?: string | null }) => {
  const [selectedPathId, setSelectedPathId] = useState('full');
  const [hoveredKanda, setHoveredKanda] = useState<string | null>(null);
  const timelineRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  const filteredKandas = useMemo(() => {
    const path = PATHS.find(p => p.id === selectedPathId);
    if (!path) return KANDAS;
    return KANDAS.filter(k => path.kandas.includes(k.id));
  }, [selectedPathId]);

  useEffect(() => {
    if (activeKanda) {
      const matchedKanda = KANDAS.find(event =>
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
  }, [activeKanda]);

  return (
    <div className="min-h-screen bg-[#080705] text-[#C9A86A] font-inter pb-40">
      {/* Path Selector Panel */}
      <div className="sticky top-28 z-30 w-full bg-[#080705]/90 backdrop-blur-2xl border-y border-[#C9A86A]/5 px-10 py-16 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-[11px] tracking-[0.8em] uppercase opacity-40 font-cinzel text-[#E6CF9B]">Sacred Path</h2>
            <h3 className="text-4xl md:text-6xl font-cinzel tracking-[0.2em] uppercase text-[#F2EAD8]">The Pilgrimage</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {PATHS.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`px-10 py-5 border transition-all duration-700 text-[10px] uppercase tracking-[0.4em] font-cinzel ${
                  selectedPathId === path.id
                  ? 'border-[#C9A86A]/60 bg-[#C9A86A]/10 text-[#E6CF9B] shadow-[0_0_30px_rgba(201,168,106,0.1)]'
                  : 'border-[#C9A86A]/10 opacity-30 hover:opacity-100 hover:border-[#C9A86A]/30'
                }`}
                aria-label={`Select journey path: ${path.name}`}
              >
                {path.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={selectedPathId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.5, y: 0 }}
            className="max-w-7xl mx-auto mt-10 text-center text-[10px] tracking-[0.6em] italic font-cinzel uppercase"
          >
            {PATHS.find(p => p.id === selectedPathId)?.description}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-8 relative mt-40">
        {/* Vertical Journey Line - Divine Silk */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#C9A86A]/30 to-transparent hidden lg:block" />

        <div className="space-y-48">
          {filteredKandas.map((event, i) => {
            const isActive = activeKanda && (
              event.id.toLowerCase().includes(activeKanda.toLowerCase()) ||
              activeKanda.toLowerCase().includes(event.id.toLowerCase())
            );

            const isEven = i % 2 === 0;

            return (
              <motion.div
                key={event.id}
                ref={el => { timelineRefs.current[event.id] = el; }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredKanda(event.id)}
                onMouseLeave={() => setHoveredKanda(null)}
                className={`relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-32`}
              >
                {/* Journey Node - Spiritual Focal Point */}
                <div className="absolute left-1/2 -translate-x-1/2 w-6 h-6 border border-[#C9A86A]/30 rounded-full bg-[#080705] z-10 hidden lg:flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: isActive || hoveredKanda === event.id ? [1, 2, 1] : 1,
                      opacity: isActive || hoveredKanda === event.id ? [0.4, 1, 0.4] : 0.2
                    }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-full h-full bg-[#C9A86A] rounded-full blur-[6px]"
                  />
                  <div className="absolute w-2 h-2 bg-[#E6CF9B] rounded-full" />
                </div>

                <div className={`w-full lg:w-1/2 ${isEven ? 'lg:text-right' : 'lg:text-left'} space-y-8`}>
                  <motion.span
                    className="text-[11px] uppercase tracking-[0.8em] text-[#C9A86A] opacity-40 font-cinzel"
                    animate={{ opacity: hoveredKanda === event.id ? 1 : 0.4 }}
                  >
                    {event.kanda}
                  </motion.span>
                  <h3 className={`text-4xl md:text-6xl font-cinzel tracking-[0.1em] uppercase transition-all duration-1000 ${
                    isActive ? 'text-[#F2EAD8] text-glow' : 'text-[#C9A86A]/40 group-hover:text-[#C9A86A]/80'
                  }`}>
                    {event.title}
                  </h3>
                  <div className={`flex flex-wrap gap-3 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    {event.events.map((ev, idx) => (
                      <span key={idx} className="text-[9px] uppercase tracking-[0.3em] font-cinzel opacity-25 border border-[#C9A86A]/10 px-3 py-1.5 rounded-full hover:opacity-100 hover:border-[#C9A86A]/40 transition-all duration-500">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className={`p-12 border transition-all duration-1000 bg-[#11100D]/40 backdrop-blur-md rounded-lg relative overflow-hidden group ${
                    isActive
                      ? 'border-[#C9A86A]/40 shadow-[0_0_100px_rgba(201,168,106,0.05)]'
                      : 'border-[#C9A86A]/5 hover:border-[#C9A86A]/20'
                  }`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C9A86A]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <p className="text-xl md:text-2xl leading-relaxed font-cormorant italic text-[#F2EAD8]/90 mb-12 relative z-10">
                      {event.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-12 pt-10 border-t border-[#C9A86A]/10 relative z-10">
                      <div className="space-y-4">
                        <span className="text-[9px] uppercase tracking-[0.6em] text-[#C9A86A] opacity-40 block font-cinzel">Core Theme</span>
                        <span className="text-[12px] uppercase tracking-[0.3em] text-[#E6CF9B] font-cinzel">{event.theme}</span>
                      </div>
                      <div className="space-y-4">
                        <span className="text-[9px] uppercase tracking-[0.6em] text-[#C9A86A] opacity-40 block font-cinzel">Sacred Journey</span>
                        <span className="text-[12px] uppercase tracking-[0.3em] text-[#F2EAD8] font-cinzel">{event.journey}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
