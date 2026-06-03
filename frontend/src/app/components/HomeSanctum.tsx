'use client';

import React from 'react';
import { motion } from 'framer-motion';

const HomeSanctum = () => {
  const scrollToPilgrimage = () => {
    const courtyard = document.getElementById('courtyard');
    courtyard?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center px-10 overflow-hidden bg-[#050505]">
      {/* Cinematic Environmental Background: Ayodhya at Dawn */}
      <div className="absolute inset-0 z-0">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a120b] via-[#050505] to-[#050505]" />

        {/* Morning Glow / Sun Rise Silhouette */}
        <motion.div
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-radial-gradient from-[#D4AF37]/10 to-transparent blur-[120px]"
        />

        {/* Temple Architecture Silhouette Layer */}
        <div className="absolute bottom-0 left-0 w-full h-[60vh] opacity-20 pointer-events-none">
           <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full flex items-end justify-between px-20">
              <div className="w-24 h-[90%] bg-gradient-to-t from-[#D4AF37]/40 to-transparent rounded-t-full blur-sm" />
              <div className="w-32 h-full bg-gradient-to-t from-[#D4AF37]/50 to-transparent rounded-t-full blur-sm" />
              <div className="w-48 h-[120%] bg-gradient-to-t from-[#D4AF37]/60 to-transparent rounded-t-full blur-md" />
              <div className="w-32 h-full bg-gradient-to-t from-[#D4AF37]/50 to-transparent rounded-t-full blur-sm" />
              <div className="w-24 h-[90%] bg-gradient-to-t from-[#D4AF37]/40 to-transparent rounded-t-full blur-sm" />
           </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="relative z-10 text-center space-y-16 max-w-6xl"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            <h2 className="text-[13px] tracking-[1.2em] uppercase font-cinzel text-[#D4AF37] mb-4">
              The Eternal Journey of Dharma
            </h2>
          </motion.div>

          <motion.h1
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-[10rem] font-cinzel tracking-[0.05em] uppercase text-[#F2EAD8] leading-tight"
          >
            Sanctum
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 2, duration: 2 }}
            className="text-xl md:text-2xl font-cormorant italic text-[#D4AF37] tracking-wider"
          >
            Walk the path of Rama through the living wisdom of the Ramayana.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 2 }}
          className="flex flex-col md:flex-row items-center justify-center gap-10 pt-10"
        >
          <button
            onClick={scrollToPilgrimage}
            className="group relative px-16 py-6 overflow-hidden border border-[#D4AF37]/30 transition-all duration-700 hover:border-[#D4AF37]/60"
            aria-label="Enter Ayodhya and begin the journey"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            <span className="relative z-10 text-[11px] uppercase tracking-[0.8em] font-cinzel text-[#D4AF37]">
              Enter Ayodhya
            </span>
          </button>

          <button
            onClick={scrollToPilgrimage}
            className="text-[10px] uppercase tracking-[0.6em] font-cinzel text-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-500"
          >
            Begin the Journey
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Corners */}
      <div className="absolute top-12 left-12 w-32 h-32 border-t border-l border-[#D4AF37]/20" />
      <div className="absolute top-12 right-12 w-32 h-32 border-t border-r border-[#D4AF37]/20" />
      <div className="absolute bottom-12 left-12 w-32 h-32 border-b border-l border-[#D4AF37]/20" />
      <div className="absolute bottom-12 right-12 w-32 h-32 border-b border-r border-[#D4AF37]/20" />

      {/* Scroll Hint */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent" />
      </motion.div>
    </div>
  );
};

export default HomeSanctum;
