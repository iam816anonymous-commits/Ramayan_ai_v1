'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  view: 'daily' | 'archive' | 'about';
}

const SupportingSpaces = ({ view }: Props) => {
  const content = {
    daily: {
      title: 'Daily Wisdom',
      subtitle: 'The Morning Offering',
      description: 'Receive a sacred teaching each day to guide your actions and purify your thoughts in accordance with Dharma.',
      detail: 'Quiet temple courtyard at dawn.',
    },
    archive: {
      title: 'Wisdom Archive',
      subtitle: 'Hall of Preserved Teachings',
      description: 'Journey through the collective wisdom of previous inquiries and timeless truths preserved in the Sanctum.',
      detail: 'Infinite scrolls of divine knowledge.',
    },
    about: {
      title: 'The Sanctum',
      subtitle: 'Temple Corridor',
      description: 'A digital spiritual sanctuary dedicated to the immortal wisdom of the Ramayana. Created for contemplation, seeking, and spiritual growth.',
      detail: 'Crafted with devotion and ancient precision.',
    }
  };

  const active = content[view];

  return (
    <div className="min-h-screen px-10 flex items-center justify-center bg-[#050505] stone-grain py-48">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full border border-[#D4AF37]/10 bg-[#11100D]/40 p-24 md:p-40 text-center space-y-16 relative"
      >
        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-[#D4AF37]/20" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-[#D4AF37]/20" />

        <div className="space-y-6">
          <span className="text-[11px] uppercase tracking-[1em] text-[#D4AF37] font-cinzel">
            {active.subtitle}
          </span>
          <h2 className="text-5xl md:text-[6rem] font-cinzel tracking-widest uppercase text-[#F2EAD8]">
            {active.title}
          </h2>
        </div>

        <div className="w-16 h-[1px] bg-[#D4AF37]/20 mx-auto" />

        <p className="text-2xl md:text-4xl font-cormorant italic text-[#B7AA92] leading-relaxed max-w-4xl mx-auto">
          &ldquo;{active.description}&rdquo;
        </p>

        <div className="pt-10">
          <span className="text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">
            Atmosphere: {active.detail}
          </span>
        </div>

        <div className="pt-20">
           <button
            className="px-16 py-6 border border-[#D4AF37]/20 text-[11px] uppercase tracking-[0.8em] font-cinzel text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
            aria-label={`Enter the ${active.title} space`}
           >
              Enter Space
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SupportingSpaces;
