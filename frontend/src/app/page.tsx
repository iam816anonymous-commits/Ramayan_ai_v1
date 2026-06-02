'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SanctumChat from './components/SanctumChat';
import Timeline from './components/Timeline';
import SagePresence from './components/SagePresence';

export default function Home() {
  const [view, setView] = useState<'sanctum' | 'chronicles'>('sanctum');

  return (
    <main className="min-h-screen bg-[#050505] text-[#D4AF37] font-lora selection:bg-[#D4AF37]/20 selection:text-[#FDFCF0] overflow-x-hidden">
      {/* Background Sage Presence remains constant across views except for Sanctum where it is handled internally */}
      {view !== 'sanctum' && <SagePresence />}

      {/* Global Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center p-8 pointer-events-none">
        <div className="flex items-center space-x-12 bg-black/40 backdrop-blur-xl px-12 py-4 border border-[#D4AF37]/10 rounded-full pointer-events-auto">
          <button
            onClick={() => setView('sanctum')}
            className={`text-[10px] uppercase tracking-[0.5em] transition-all ${view === 'sanctum' ? 'text-[#FDFCF0] opacity-100' : 'opacity-30 hover:opacity-60'}`}
          >
            Sanctum
          </button>
          <div className="w-[1px] h-4 bg-[#D4AF37]/10" />
          <button
            onClick={() => setView('chronicles')}
            className={`text-[10px] uppercase tracking-[0.5em] transition-all ${view === 'chronicles' ? 'text-[#FDFCF0] opacity-100' : 'opacity-30 hover:opacity-60'}`}
          >
            Divine Path
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {view === 'sanctum' ? (
          <motion.div
            key="sanctum"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="pt-24"
          >
            <SanctumChat />
          </motion.div>
        ) : (
          <motion.div
            key="chronicles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="pt-24"
          >
            <Timeline />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
