'use client';

import React from 'react';
import { motion } from 'framer-motion';
import IntricateBorder from './IntricateBorder';

const HomeSanctum = () => {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-10 overflow-hidden">
      {/* Environmental Scene: Ayodhya Sunrise simulation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#C9A86A]/5 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#080705] to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center space-y-12 max-w-5xl"
      >
        <div className="space-y-4">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '1em' }}
            animate={{ opacity: 0.4, letterSpacing: '1.2em' }}
            transition={{ duration: 3 }}
            className="text-[12px] uppercase font-cinzel text-[#E6CF9B] block"
          >
            Welcome to the Divine
          </motion.span>
          <h1 className="text-6xl md:text-9xl font-cinzel tracking-[0.1em] uppercase text-[#F2EAD8] text-glow">
            Sanctum
          </h1>
        </div>

        <div className="w-24 h-[1px] bg-[#C9A86A]/30 mx-auto" />

        <p className="text-xl md:text-3xl font-cormorant italic text-[#B7AA92] leading-relaxed max-w-3xl mx-auto">
          &ldquo;Where ancient wisdom meets the seeking soul. Step into the living temple of the Ramayana and discover the eternal light of Dharma.&rdquo;
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="pt-12"
        >
          <IntricateBorder className="p-1 px-12 inline-block bg-[#11100D]/40 backdrop-blur-md">
            <button className="py-6 text-[11px] uppercase tracking-[0.8em] font-cinzel text-[#E6CF9B] hover:text-[#F2EAD8] transition-colors">
              Begin the Journey
            </button>
          </IntricateBorder>
        </motion.div>
      </motion.div>

      {/* Decorative Pillars - Conceptual */}
      <div className="absolute left-0 top-0 bottom-0 w-32 border-r border-[#C9A86A]/5 hidden lg:block" />
      <div className="absolute right-0 top-0 bottom-0 w-32 border-l border-[#C9A86A]/5 hidden lg:block" />
    </div>
  );
};

export default HomeSanctum;
