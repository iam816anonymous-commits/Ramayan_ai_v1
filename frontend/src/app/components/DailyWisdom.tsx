'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DailyShloka {
  text: string;
  transliteration: string;
  translation: string;
  explanation: string;
  metadata: {
    kanda: string;
    sarga: number;
    verse: number;
  };
}

const DailyWisdom = () => {
  const [shloka, setShloka] = useState<DailyShloka | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/wisdom')
      .then(res => {
        if (!res.ok) throw new Error('Wisdom not found');
        return res.json();
      })
      .then(data => {
        setShloka(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching wisdom:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!shloka || !shloka.metadata) return null;

  return (
    <div className="min-h-screen px-10 flex items-center justify-center bg-[#050505] stone-grain py-48">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-6xl w-full border border-[#D4AF37]/10 bg-[#11100D]/40 p-12 md:p-40 text-center space-y-12 relative overflow-hidden"
      >
        {/* Decorative Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-cinzel text-[#D4AF37]/[0.02] whitespace-nowrap pointer-events-none select-none">
            {shloka.metadata.kanda}
        </div>

        <div className="space-y-6 relative z-10">
          <span className="text-[11px] uppercase tracking-[1em] text-[#D4AF37] font-cinzel">
            Daily Wisdom
          </span>
          <h2 className="text-2xl md:text-4xl font-lora italic text-[#F2EAD8] leading-relaxed">
            &ldquo;{shloka.text}&rdquo;
          </h2>
        </div>

        <div className="w-16 h-[1px] bg-[#D4AF37]/20 mx-auto" />

        <div className="space-y-8 relative z-10">
            <p className="text-xl md:text-2xl font-cormorant text-[#B7AA92] leading-relaxed max-w-4xl mx-auto italic">
                {shloka.translation}
            </p>

            <div className="max-w-3xl mx-auto bg-[#D4AF37]/5 p-8 border border-[#D4AF37]/10">
                <p className="text-sm md:text-base font-lora text-[#F2EAD8]/80 leading-loose">
                    {shloka.explanation}
                </p>
            </div>
        </div>

        <div className="pt-10 relative z-10">
          <span className="text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">
            {shloka.metadata.kanda} • Sarga {shloka.metadata.sarga} • Verse {shloka.metadata.verse}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default DailyWisdom;
