'use client';

import React from 'react';
import { motion } from 'framer-motion';
import IntricateBorder from './IntricateBorder';

const SHLOKAS = [
  { sanskrit: "रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ।", transliteration: "rāmo vigrahavān dharmaḥ sādhuḥ satyaparākramaḥ |", translation: "Rama is the embodiment of Dharma, a saintly person with truth as his prowess.", source: "Ayodhya Kanda" },
  { sanskrit: "जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥", transliteration: "jananī janmabhūmiśca svargādapi garīyasī ||", translation: "Mother and motherland are superior even to heaven.", source: "Yuddha Kanda" },
];

const ShlokaLibrary = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] px-10 space-y-24 pb-40">
      <header className="text-center space-y-6 max-w-4xl mx-auto">
        <h2 className="text-[12px] uppercase tracking-[1em] text-[#E6CF9B] font-cinzel opacity-40">Sacred Archive</h2>
        <h3 className="text-5xl md:text-7xl font-cinzel tracking-widest uppercase text-[#F2EAD8]">Shloka Library</h3>
        <p className="text-xl font-cormorant italic text-[#B7AA92]">&ldquo;The preserved sounds of eternity, captured in the world&apos;s first epic.&rdquo;</p>
      </header>

      <div className="grid grid-cols-1 gap-20 max-w-6xl mx-auto">
        {SHLOKAS.map((shloka, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: i * 0.2 }}
          >
            <IntricateBorder className="bg-[#11100D]/60 p-16 space-y-12 relative group hover:bg-[#11100D]/80 transition-all duration-1000">
               <div className="absolute top-8 right-12 text-[10px] uppercase tracking-[0.4em] font-cinzel text-[#C9A86A] opacity-30">
                 {shloka.source}
               </div>

               <div className="space-y-12">
                 <div className="text-center space-y-8">
                   <h4 className="text-4xl md:text-6xl text-[#E6CF9B] font-serif leading-loose tracking-wide">
                     {shloka.sanskrit}
                   </h4>
                   <p className="text-lg md:text-xl font-cormorant italic text-[#B7AA92] opacity-60 tracking-widest">
                     {shloka.transliteration}
                   </p>
                 </div>

                 <div className="w-12 h-[1px] bg-[#C9A86A]/20 mx-auto" />

                 <div className="max-w-3xl mx-auto text-center space-y-6">
                    <span className="text-[9px] uppercase tracking-[0.6em] text-[#C9A86A] opacity-40 font-cinzel">Translation</span>
                    <p className="text-2xl md:text-3xl font-cormorant text-[#F2EAD8] leading-relaxed italic">
                      &ldquo;{shloka.translation}&rdquo;
                    </p>
                 </div>
               </div>

               <div className="flex justify-center pt-8">
                  <button className="text-[10px] uppercase tracking-[0.4em] font-cinzel text-[#C9A86A] opacity-30 hover:opacity-100 transition-all border border-[#C9A86A]/10 px-8 py-3 rounded-full">
                    View Explanation
                  </button>
               </div>
            </IntricateBorder>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShlokaLibrary;
