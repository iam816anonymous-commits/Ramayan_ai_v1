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
  kandas: string[];
}

const KANDAS: KandaInfo[] = [
  {
    "id": "Bala",
    "kanda": "Bala Kanda",
    "title": "The Divine Birth",
    "summary": "The origin of Dharma. Witness the birth of Rama and his early journey with Sage Vishwamitra.",
    "theme": "The Dawn of Purpose",
    "events": ["Birth of Rama", "Slaying of Tataka", "Breaking of Shiva's Bow", "Marriage to Sita"],
    "journey": "Ayodhya → Mithila"
  },
  {
    "id": "Ayodhya",
    "kanda": "Ayodhya Kanda",
    "title": "The Great Exile",
    "summary": "A test of devotion and duty. Rama accepts his father's command to live in the forest for fourteen years.",
    "theme": "The Path of Sacrifice",
    "events": ["Kaikeyi's Boon", "Dasharatha's Grief", "Rama's Departure", "Bharata's Meeting"],
    "journey": "Ayodhya → Chitrakoot"
  },
  {
    "id": "Aranya",
    "kanda": "Aranya Kanda",
    "title": "The Forest Dwellers",
    "summary": "In the depths of the wild, a darkness looms. Sita is abducted by the demon king Ravana.",
    "theme": "The Trial of Shadows",
    "events": ["Slaying of Khara", "The Golden Deer", "Sita's Abduction", "Meeting Jatayu"],
    "journey": "Chitrakoot → Dandaka Forest"
  },
  {
    "id": "Kishkindha",
    "kanda": "Kishkindha Kanda",
    "title": "The Sacred Alliance",
    "summary": "Friendship blooms in the monkey kingdom. Rama forms an alliance with Sugriva and meets Hanuman.",
    "theme": "The Power of Union",
    "events": ["Meeting Hanuman", "Slaying of Vali", "Search for Sita Begins", "Sampati's Vision"],
    "journey": "Dandaka → Kishkindha"
  },
  {
    "id": "Sundara",
    "kanda": "Sundara Kanda",
    "title": "Hanuman's Leap",
    "summary": "Devotion incarnate. Hanuman leaps across the ocean to find Sita in the golden city of Lanka.",
    "theme": "The Light of Hope",
    "events": ["Leaping the Ocean", "Finding Sita", "Burning of Lanka", "Return to Rama"],
    "journey": "Kishkindha → Lanka"
  },
  {
    "id": "Yuddha",
    "kanda": "Yuddha Kanda",
    "title": "The Final Victory",
    "summary": "The culmination of Dharma. The great battle concludes with the fall of Ravana and the return to Ayodhya.",
    "theme": "The Triumph of Truth",
    "events": ["Building the Bridge", "The Great Battle", "Fall of Ravana", "Rama's Coronation"],
    "journey": "Lanka → Ayodhya"
  }
];

const PATHS: Path[] = [
  {
    id: 'full',
    name: 'The Eternal Path',
    description: 'Follow the complete journey of the Avatar.',
    kandas: ['Bala', 'Ayodhya', 'Aranya', 'Kishkindha', 'Sundara', 'Yuddha']
  },
  {
    id: 'exile',
    name: "The Forest Trail",
    description: "Rama's 14-year exile and the test of character.",
    kandas: ['Ayodhya', 'Aranya']
  }
];

const Timeline = () => {
  const [selectedPathId, setSelectedPathId] = useState('full');
  const [hoveredKanda, setHoveredKanda] = useState<string | null>(null);

  const filteredKandas = useMemo(() => {
    const path = PATHS.find(p => p.id === selectedPathId);
    if (!path) return KANDAS;
    return KANDAS.filter(k => path.kandas.includes(k.id));
  }, [selectedPathId]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#D4AF37] font-lora pb-64">
      {/* Path Header */}
      <div className="pt-32 pb-20 text-center space-y-6">
        <h2 className="text-[10px] tracking-[1em] uppercase opacity-40 font-cinzel">The Divine Journey</h2>
        <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] uppercase font-cinzel text-glow">Pilgrimage of Dharma</h1>
        <div className="flex justify-center gap-4 pt-12">
           {PATHS.map(p => (
             <button
               key={p.id}
               onClick={() => setSelectedPathId(p.id)}
               className={`px-8 py-3 border rounded-full text-[9px] uppercase tracking-[0.4em] transition-all duration-700 ${
                 selectedPathId === p.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-[#D4AF37]/10 opacity-30 hover:opacity-100'
               }`}
             >
               {p.name}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Central Pilgrimage Thread */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/10 to-[#D4AF37]/0" />

        <div className="space-y-48">
          {filteredKandas.map((kanda, i) => (
            <motion.div
              key={kanda.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center"
            >
              {/* Sacred Node */}
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 bg-[#050505] flex items-center justify-center z-10 mb-12 group">
                 <motion.div
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-4 h-4 bg-[#D4AF37] rounded-full blur-[4px]"
                 />
                 <div className="absolute -inset-4 border border-[#D4AF37]/5 rounded-full group-hover:border-[#D4AF37]/20 transition-colors duration-1000" />
              </div>

              {/* Content Card */}
              <div className="w-full text-center space-y-8 max-w-2xl">
                 <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.6em] opacity-30 font-cinzel">{kanda.kanda}</span>
                    <h3 className="text-3xl md:text-5xl font-light tracking-[0.1em] uppercase font-cinzel text-[#FDFCF0]">{kanda.title}</h3>
                 </div>

                 <p className="text-xl md:text-2xl font-light italic opacity-60 leading-relaxed px-6">
                    &ldquo;{kanda.summary}&rdquo;
                 </p>

                 <div className="flex flex-wrap justify-center gap-3 py-4">
                    {kanda.events.map((ev, idx) => (
                      <span key={idx} className="text-[8px] uppercase tracking-[0.2em] border border-[#D4AF37]/10 px-3 py-1 rounded-full opacity-40">
                        {ev}
                      </span>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-[#D4AF37]/5 grid grid-cols-2 gap-12">
                    <div className="text-right">
                       <span className="block text-[8px] uppercase tracking-[0.4em] opacity-30 mb-1">Theme</span>
                       <span className="text-[11px] uppercase tracking-widest text-[#D4AF37]">{kanda.theme}</span>
                    </div>
                    <div className="text-left">
                       <span className="block text-[8px] uppercase tracking-[0.4em] opacity-30 mb-1">Journey</span>
                       <span className="text-[11px] uppercase tracking-widest text-[#FDFCF0]">{kanda.journey}</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative End Node */}
      <div className="mt-48 flex flex-col items-center opacity-10">
         <div className="w-[1px] h-32 bg-gradient-to-b from-[#D4AF37] to-transparent" />
         <span className="mt-8 text-[10px] uppercase tracking-[1em] font-cinzel">The Eternal Return</span>
      </div>
    </div>
  );
};

export default Timeline;
