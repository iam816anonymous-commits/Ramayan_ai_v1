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
    <div className="min-h-screen bg-[#050505] text-[#D4AF37] font-lora pb-32">
      {/* Path Selector Panel */}
      <div className="sticky top-24 z-30 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-[#D4AF37]/5 px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-[10px] tracking-[0.8em] uppercase opacity-40 font-cinzel font-light">Path Selector</h2>
            <h3 className="text-3xl md:text-5xl font-light tracking-widest uppercase text-[#FDFCF0] font-cinzel">Divine Path</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {PATHS.map((path) => (
              <button
                key={path.id}
                onClick={() => setSelectedPathId(path.id)}
                className={`px-8 py-4 border transition-all text-[10px] uppercase tracking-[0.3em] ${
                  selectedPathId === path.id
                  ? 'border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#FDFCF0]'
                  : 'border-[#D4AF37]/10 opacity-30 hover:opacity-60'
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="max-w-7xl mx-auto mt-8 text-center text-xs tracking-widest italic"
          >
            {PATHS.find(p => p.id === selectedPathId)?.description}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative mt-32">
        {/* Vertical Journey Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 hidden lg:block" />

        <div className="space-y-32">
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
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHoveredKanda(event.id)}
                onMouseLeave={() => setHoveredKanda(null)}
                className={`relative flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}
              >
                {/* Journey Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 border border-[#D4AF37]/40 rounded-full bg-[#050505] z-10 hidden lg:flex items-center justify-center">
                  <motion.div
                    animate={{ scale: isActive || hoveredKanda === event.id ? 2 : 1, opacity: isActive || hoveredKanda === event.id ? 1 : 0 }}
                    className="w-full h-full bg-[#D4AF37] rounded-full blur-[4px]"
                  />
                </div>

                <div className={`w-full lg:w-1/2 ${isEven ? 'lg:text-right' : 'lg:text-left'}`}>
                  <span className="text-[10px] uppercase tracking-[0.5em] opacity-30 mb-4 block font-light">
                    {event.kanda}
                  </span>
                  <h3 className={`text-3xl md:text-5xl mb-6 font-light tracking-widest uppercase transition-colors duration-1000 ${
                    isActive ? 'text-[#FDFCF0]' : 'text-[#D4AF37]/60'
                  }`}>
                    {event.title}
                  </h3>
                  <div className={`flex flex-wrap gap-2 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                    {event.events.map((ev, idx) => (
                      <span key={idx} className="text-[8px] uppercase tracking-[0.2em] opacity-20 border border-[#D4AF37]/10 px-2 py-1">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-1/2">
                  <div className={`p-10 border transition-all duration-1000 bg-[#080808]/20 backdrop-blur-sm ${
                    isActive
                      ? 'border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.05)]'
                      : 'border-[#D4AF37]/5 hover:border-[#D4AF37]/20'
                  }`}>
                    <p className="text-lg md:text-xl leading-relaxed font-light text-[#FDFCF0]/80 mb-8">
                      {event.summary}
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#D4AF37]/10">
                      <div className="space-y-3">
                        <span className="text-[8px] uppercase tracking-[0.4em] opacity-30 block">Core Theme</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-medium">{event.theme}</span>
                      </div>
                      <div className="space-y-3">
                        <span className="text-[8px] uppercase tracking-[0.4em] opacity-30 block">Sacred Journey</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#FDFCF0]">{event.journey}</span>
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
