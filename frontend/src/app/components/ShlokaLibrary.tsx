'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Shloka {
  sanskrit: string;
  transliteration: string;
  translation: string;
  significance: string;
  context: string;
  verse_id?: string;
}

const STATIC_SHLOKAS: Shloka[] = [
  {
    sanskrit: "रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः।",
    transliteration: "rāmo vigrahavān dharmaḥ sādhuḥ satyaparākramaḥ |",
    translation: "Rama is the personification of Dharma, the righteous and one whose prowess is truth.",
    significance: "Spoken by Maricha, this shloka defines the absolute identification of Rama with righteousness.",
    context: "Aranya Kanda"
  },
  {
    sanskrit: "सकृदेव प्रपन्नाय तवास्मीति च याचते। अभयं सर्वभूतेभ्यो ददाम्येतद् व्रतं मम॥",
    transliteration: "sakṛdeva prapannāya tavāsmīti ca yācate | abhayaṃ sarvabhūtebhyo dadāmyetad vrataṃ mama ||",
    translation: "To anyone who once takes shelter in me and says &lsquo;I am yours&rsquo;, I grant fearlessness from all beings. This is my vow.",
    significance: "Rama's promise of protection to Vibhishana, emphasizing divine mercy.",
    context: "Yuddha Kanda"
  },
  {
    sanskrit: "जननी जन्मभूमिश्च स्वर्गादपि गरीयसी।",
    transliteration: "jananī janmabhūmiśca svargādapi garīyasī |",
    translation: "Mother and motherland are superior even to heaven.",
    significance: "Rama's declaration after the victory in Lanka, showing his detached nature and love for Ayodhya.",
    context: "Yuddha Kanda"
  }
];

const ShlokaLibrary = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shlokas, setShlokas] = useState<Shloka[]>(STATIC_SHLOKAS);
  const [isRevelatory, setIsRevelatory] = useState(false);

  useEffect(() => {
    // Listen for custom events from SanctumChat to show relevant shlokas
    const handleRelevance = (event: any) => {
      const { verse, context, text, translation, explanation } = event.detail;
      if (text && translation) {
        const newShloka: Shloka = {
          sanskrit: text,
          transliteration: "", // Might be missing in source
          translation: translation,
          significance: explanation || "A verse relevant to your current inquiry.",
          context: context || "Scriptures",
          verse_id: verse
        };

        setShlokas(prev => {
          // Check if already exists
          if (prev.some(s => s.sanskrit === text)) return prev;
          return [newShloka, ...prev].slice(0, 10); // Keep last 10
        });
        setCurrentIndex(0);
        setIsRevelatory(true);

        // Auto-scroll to archive
        const element = document.getElementById('archive');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('revelation-shloka', handleRelevance);
    return () => window.removeEventListener('revelation-shloka', handleRelevance);
  }, []);

  const nextShloka = () => setCurrentIndex((prev) => (prev + 1) % shlokas.length);
  const prevShloka = () => setCurrentIndex((prev) => (prev - 1 + shlokas.length) % shlokas.length);

  return (
    <section id="archive" className="relative min-h-screen py-48 bg-[#080705] overflow-hidden stone-grain">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="text-center mb-32 space-y-8">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[11px] uppercase tracking-[1.2em] text-[#D4AF37] font-cinzel block"
          >
            Ancient Scrolls
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-[8rem] font-cinzel tracking-widest uppercase text-[#F2EAD8]"
          >
            {isRevelatory ? "Divine Revelation" : "Wisdom Archive"}
          </motion.h2>
          <p className="text-xl md:text-2xl font-cormorant italic text-[#B7AA92] max-w-2xl mx-auto opacity-60">
            {isRevelatory
              ? "The Sage has uncovered a verse that resonates with your heart's inquiry."
              : "Step into the manuscript chamber and contemplate the eternal sounds of the first epic."}
          </p>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="w-full max-w-5xl relative min-h-[600px] flex items-center justify-center">
             <AnimatePresence mode="wait">
               <motion.div
                 key={currentIndex + shlokas[currentIndex].sanskrit}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="w-full bg-[#11100D] border border-[#D4AF37]/10 p-12 md:p-24 shadow-2xl relative"
               >
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

                  <div className="space-y-16">
                    <div className="space-y-10 text-center">
                      <span className="text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]/40 font-cinzel">
                        {shlokas[currentIndex].context} {shlokas[currentIndex].verse_id ? `| Verse ${shlokas[currentIndex].verse_id}` : ''}
                      </span>
                      <h3 className="text-4xl md:text-5xl font-serif text-[#F2EAD8] leading-relaxed">
                        {shlokas[currentIndex].sanskrit}
                      </h3>
                    </div>

                    <div className="w-12 h-[1px] bg-[#D4AF37]/20 mx-auto" />

                    <div className="space-y-12">
                      {shlokas[currentIndex].transliteration && (
                        <p className="text-xl md:text-2xl font-cinzel tracking-[0.1em] text-[#D4AF37]/80 text-center uppercase italic opacity-60">
                          {shlokas[currentIndex].transliteration}
                        </p>
                      )}
                      <p className="text-2xl md:text-4xl font-cormorant italic text-[#F2EAD8]/90 text-center leading-relaxed">
                        &ldquo;{shlokas[currentIndex].translation}&rdquo;
                      </p>
                    </div>

                    <div className="pt-10 border-t border-[#D4AF37]/5">
                       <h4 className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel mb-4 text-center">Spiritual Significance</h4>
                       <p className="text-xl font-cormorant italic text-[#B7AA92] text-center max-w-2xl mx-auto">
                         {shlokas[currentIndex].significance}
                       </p>
                    </div>
                  </div>
               </motion.div>
             </AnimatePresence>

             <div className="absolute top-1/2 -left-12 -translate-y-1/2 hidden md:block">
                <button onClick={prevShloka} className="p-4 border border-[#D4AF37]/10 text-[#D4AF37]/40 hover:text-[#D4AF37] transition-all">
                  ←
                </button>
             </div>
             <div className="absolute top-1/2 -right-12 -translate-y-1/2 hidden md:block">
                <button onClick={nextShloka} className="p-4 border border-[#D4AF37]/10 text-[#D4AF37]/40 hover:text-[#D4AF37] transition-all">
                  →
                </button>
             </div>
          </div>

          <div className="mt-20 flex gap-4">
             {shlokas.map((_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentIndex(i)}
                 className={`w-2 h-2 rounded-full transition-all duration-700 ${i === currentIndex ? 'bg-[#D4AF37] w-8' : 'bg-[#D4AF37]/20'}`}
               />
             ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 pointer-events-none">
         <div className="w-full h-full border-t border-l border-[#D4AF37]/20 rotate-12 translate-x-32 translate-y-32" />
      </div>
    </section>
  );
};

export default ShlokaLibrary;
