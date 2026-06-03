'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntricateBorder from './IntricateBorder';

const CHARACTERS = [
  { name: 'Rama', title: 'The Maryada Purushottama', role: 'Avatar of Vishnu', traits: ['Dharma', 'Duty', 'Patience'] },
  { name: 'Sita', title: 'The Earth-Born Queen', role: 'Avatar of Lakshmi', traits: ['Devotion', 'Strength', 'Purity'] },
  { name: 'Hanuman', title: 'The Son of Vayu', role: 'Divine Vanara', traits: ['Loyalty', 'Strength', 'Bhakti'] },
  { name: 'Lakshmana', title: 'The Eternal Companion', role: 'Shesha Incarnate', traits: ['Service', 'Protection', 'Valor'] },
  { name: 'Ravana', title: 'The Ten-Headed Scholar', role: 'King of Lanka', traits: ['Ego', 'Knowledge', 'Power'] },
];

const CharacterExplorer = () => {
  const [activeChar, setActiveChar] = useState(CHARACTERS[0]);

  return (
    <div className="min-h-[calc(100vh-8rem)] px-10 flex flex-col lg:flex-row gap-16">
      {/* Sidebar: Character Roster */}
      <div className="w-full lg:w-1/4 space-y-8 border-r border-[#C9A86A]/5 pr-10">
        <header className="pb-8">
          <h2 className="text-[11px] uppercase tracking-[0.6em] text-[#E6CF9B] font-cinzel opacity-40">The Great Lineage</h2>
          <h3 className="text-3xl font-cinzel tracking-widest uppercase text-[#F2EAD8]">Character Hall</h3>
        </header>

        <div className="space-y-4">
          {CHARACTERS.map((char) => (
            <button
              key={char.name}
              onClick={() => setActiveChar(char)}
              className={`w-full text-left p-6 border transition-all duration-700 font-cinzel ${
                activeChar.name === char.name
                ? 'border-[#C9A86A]/40 bg-[#C9A86A]/5 text-[#E6CF9B]'
                : 'border-transparent opacity-30 hover:opacity-100 hover:text-[#E6CF9B]'
              }`}
            >
              <span className="text-[10px] uppercase tracking-[0.4em]">{char.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main: Character Manuscript */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChar.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <IntricateBorder className="h-full bg-[#11100D]/40 p-16 relative overflow-hidden group">
              {/* Background Manuscript Texture Effect */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/parchment.png')] opacity-[0.03] pointer-events-none" />

              <div className="relative z-10 space-y-12">
                <header className="space-y-4">
                  <span className="text-[11px] uppercase tracking-[0.8em] text-[#C9A86A] opacity-40 font-cinzel">{activeChar.role}</span>
                  <h2 className="text-6xl md:text-8xl font-cinzel tracking-[0.1em] uppercase text-[#F2EAD8]">{activeChar.name}</h2>
                  <p className="text-2xl font-cormorant italic text-[#E6CF9B]">{activeChar.title}</p>
                </header>

                <div className="w-24 h-[1px] bg-[#C9A86A]/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#C9A86A] opacity-40 font-cinzel">Divine Attributes</h4>
                    <div className="flex flex-wrap gap-4">
                      {activeChar.traits.map(trait => (
                        <span key={trait} className="px-5 py-2 border border-[#C9A86A]/10 text-[10px] uppercase tracking-[0.3em] font-cinzel text-[#F2EAD8]/80">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#C9A86A] opacity-40 font-cinzel">Manuscript Notes</h4>
                    <p className="text-xl font-cormorant leading-relaxed text-[#B7AA92]">
                      The journey of {activeChar.name} is a testament to the eternal principles of the Ramayana. Their role in the epic illuminates the path of {activeChar.traits[0]} and guides seekers toward truth.
                    </p>
                  </div>
                </div>

                <div className="pt-12">
                   <button className="text-[9px] uppercase tracking-[0.6em] text-[#E6CF9B] border-b border-[#C9A86A]/20 pb-2 hover:border-[#C9A86A] transition-all font-cinzel">
                     Explore Thread of Fate
                   </button>
                </div>
              </div>
            </IntricateBorder>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CharacterExplorer;
