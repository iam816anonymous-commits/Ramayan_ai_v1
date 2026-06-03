'use client';

import React from 'react';
import { motion } from 'framer-motion';
import IntricateBorder from './IntricateBorder';

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
    <div className="min-h-[calc(100vh-8rem)] px-10 flex items-center justify-center">
      <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full"
      >
        <IntricateBorder className="bg-[#11100D]/40 p-20 text-center space-y-12">
          <div className="space-y-4">
            <span className="text-[11px] uppercase tracking-[0.8em] text-[#C9A86A] opacity-40 font-cinzel">
              {active.subtitle}
            </span>
            <h2 className="text-5xl md:text-7xl font-cinzel tracking-widest uppercase text-[#F2EAD8]">
              {active.title}
            </h2>
          </div>

          <div className="w-16 h-[1px] bg-[#C9A86A]/20 mx-auto" />

          <p className="text-2xl font-cormorant italic text-[#B7AA92] leading-relaxed">
            &ldquo;{active.description}&rdquo;
          </p>

          <div className="pt-8">
            <span className="text-[9px] uppercase tracking-[0.6em] text-[#C9A86A] opacity-30 font-cinzel">
              Atmosphere: {active.detail}
            </span>
          </div>

          <div className="pt-12">
             <button className="px-10 py-5 border border-[#C9A86A]/10 text-[10px] uppercase tracking-[0.5em] font-cinzel text-[#E6CF9B] hover:bg-[#C9A86A]/5 transition-all">
                Enter Space
             </button>
          </div>
        </IntricateBorder>
      </motion.div>
    </div>
  );
};

export default SupportingSpaces;
