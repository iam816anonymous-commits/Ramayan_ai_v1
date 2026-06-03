'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  y: number[];
  x: number[];
  duration: number;
  left: string;
  top: string;
}

const SacredCourtyard = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const newParticles = [...Array(20)].map(() => ({
      y: [Math.random() * 1000, Math.random() * 1000],
      x: [Math.random() * 1000, Math.random() * 1000],
      duration: 10 + Math.random() * 20,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`
    }));
    setParticles(newParticles);
  }, []);

  const pillars = [
    {
      title: "Sit",
      sanskrit: "आसन",
      description: "Find stillness in the presence of the eternal. Contemplate the path of Dharma through the silence of the heart.",
    },
    {
      title: "Ask",
      sanskrit: "प्रश्न",
      description: "Offer your inquiries to the Sage. Seek clarity amidst the shadows of doubt that cloud the human journey.",
    },
    {
      title: "Reflect",
      sanskrit: "ध्यान",
      description: "Absorb the revelation. Let the wisdom of Rama guide your inner world as a beacon in the darkness.",
    }
  ];

  if (!mounted) return <section className="min-h-screen bg-[#080705]" />;

  return (
    <section className="relative min-h-screen py-48 flex flex-col items-center justify-center bg-[#080705] overflow-hidden stone-grain">
      {/* Sacred Light - Light Shafts from above */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[30vw] h-full bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent -rotate-12 blur-3xl opacity-40" />
        <div className="absolute top-0 right-1/4 w-[20vw] h-full bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent rotate-6 blur-3xl opacity-30" />
      </div>

      {/* Architectural Silhouettes - Pillars */}
      <div className="absolute inset-0 z-0 opacity-10 flex justify-between px-20 pointer-events-none">
         <div className="w-1 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent h-full" />
         <div className="w-1 bg-gradient-to-b from-transparent via-[#D4AF37]/40 to-transparent h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10 w-full">
        <div className="text-center mb-48 space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            className="text-[12px] uppercase tracking-[1em] text-[#D4AF37] font-cinzel block"
          >
            Philosophy of the Path
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 2 }}
            className="text-5xl md:text-8xl font-cinzel tracking-widest uppercase text-[#F2EAD8]"
          >
            The Sacred Courtyard
          </motion.h2>
          <div className="w-24 h-[1px] bg-[#D4AF37]/20 mx-auto mt-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-24 md:gap-32">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3, duration: 2 }}
              className="relative flex flex-col items-center text-center space-y-10 group"
            >
              <div className="absolute -top-16 text-9xl font-serif text-[#D4AF37]/5 select-none pointer-events-none group-hover:text-[#D4AF37]/10 transition-colors duration-1000">
                {pillar.sanskrit}
              </div>

              <div className="relative space-y-6">
                <h3 className="text-4xl font-cinzel tracking-[0.5em] uppercase text-[#D4AF37]">
                  {pillar.title}
                </h3>
                <div className="flex justify-center">
                  <div className="w-8 h-[1px] bg-[#D4AF37]/40 group-hover:w-24 transition-all duration-1000" />
                </div>
              </div>

              <p className="text-xl md:text-2xl font-cormorant italic text-[#B7AA92] leading-relaxed max-w-sm">
                {pillar.description}
              </p>

              <div className="pt-10 w-full">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent" />
                <div className="mt-1 flex justify-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37]/20" />
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37]/20" />
                  <div className="w-1 h-1 rounded-full bg-[#D4AF37]/20" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Atmospheric Dust/Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            animate={{
              y: p.y,
              x: p.x,
              opacity: [0, 0.2, 0]
            }}
            transition={{ duration: p.duration, repeat: Infinity }}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            style={{ left: p.left, top: p.top }}
          />
        ))}
      </div>
    </section>
  );
};

export default SacredCourtyard;
