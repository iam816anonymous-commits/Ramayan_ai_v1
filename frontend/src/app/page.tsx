'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SanctumChat from './components/SanctumChat';
import Timeline from './components/Timeline';
import SagePresence from './components/SagePresence';

import HomeSanctum from './components/HomeSanctum';
import CharacterExplorer from './components/CharacterExplorer';
import ShlokaLibrary from './components/ShlokaLibrary';
import SupportingSpaces from './components/SupportingSpaces';

type Experience = 'home' | 'inquiry' | 'journey' | 'characters' | 'library' | 'daily' | 'archive' | 'about';

export default function Home() {
  const [view, setView] = useState<Experience>('home');

  const navItems: { id: Experience; label: string }[] = [
    { id: 'home', label: 'The Temple Gate' },
    { id: 'inquiry', label: 'Hall of Wisdom' },
    { id: 'journey', label: 'The Pilgrimage' },
    { id: 'characters', label: 'Gallery of Icons' },
    { id: 'library', label: 'Shloka Archive' },
    { id: 'daily', label: 'Morning Prayer' },
    { id: 'archive', label: 'Ancient Scrolls' },
    { id: 'about', label: 'The Inner Sanctum' },
  ];

  return (
    <main className="min-h-screen bg-[#080705] text-[#C9A86A] font-inter selection:bg-[#C9A86A]/20 selection:text-[#F2EAD8] overflow-x-hidden">
      <SagePresence state={view === 'inquiry' ? 'thinking' : 'idle'} />

      {/* Sacred Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 flex justify-center overflow-x-auto scrollbar-hide">
        <motion.div
          className="flex flex-nowrap md:flex-wrap items-center justify-start md:justify-center gap-x-6 md:gap-x-8 gap-y-4 bg-[#11100D]/80 backdrop-blur-2xl px-6 md:px-10 py-4 md:py-5 border border-[#C9A86A]/10 rounded-full shadow-2xl"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`text-[9px] uppercase tracking-[0.4em] font-cinzel transition-all relative ${
                view === item.id ? 'text-[#E6CF9B]' : 'text-[#C9A86A]/40 hover:text-[#C9A86A]/70'
              }`}
            >
              {item.label}
              {view === item.id && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#E6CF9B]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </nav>

      {/* Experience Router */}
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="pt-32 min-h-screen"
        >
          {view === 'home' && <HomeSanctum />}
          {view === 'inquiry' && <SanctumChat />}
          {view === 'journey' && <Timeline />}
          {view === 'characters' && <CharacterExplorer />}
          {view === 'library' && <ShlokaLibrary />}
          {['daily', 'archive', 'about'].includes(view) && (
             <SupportingSpaces view={view as 'daily' | 'archive' | 'about'} />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
