'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SacredGeometry = ({ state }: { state: string }) => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center opacity-10"
    animate={{
      rotate: state === 'thinking' ? 360 : 0,
      scale: state === 'thinking' ? 1.2 : 1
    }}
    transition={{
      rotate: { duration: 60, repeat: Infinity, ease: "linear" },
      scale: { duration: 2, ease: "easeInOut" }
    }}
  >
    <svg viewBox="0 0 100 100" className="w-[800px] h-[800px]">
      <defs>
        <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sri Yantra-inspired layers */}
      <circle cx="50" cy="50" r="48" stroke="#D4AF37" fill="none" strokeWidth="0.05" />
      <circle cx="50" cy="50" r="45" stroke="#D4AF37" fill="none" strokeWidth="0.02" strokeDasharray="0.5 1" />

      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <motion.path
          key={angle}
          d="M50 10 L90 75 L10 75 Z"
          stroke="#D4AF37"
          fill="none"
          strokeWidth="0.03"
          transform={`rotate(${angle} 50 50)`}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: angle / 60 }}
        />
      ))}

      <circle cx="50" cy="50" r="15" stroke="#D4AF37" fill="url(#goldGrad)" strokeWidth="0.1" />
    </svg>
  </motion.div>
);

const SagePresence = ({ state = 'idle' }: { state?: 'idle' | 'thinking' | 'revealing' | 'speaking' }) => {
  const [mounted, setMounted] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      duration: Math.random() * 40 + 30,
      delay: Math.random() * 20,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.05
    }));
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden bg-[#050505]">
      <SacredGeometry state={state} />

      {/* Main Aura Bloom */}
      <div className="relative">
        <AnimatePresence>
          {state === 'thinking' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#D4AF37] blur-[150px] opacity-20"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={{
            scale: state === 'thinking' ? [1, 1.1, 1] : [1, 1.05, 1],
            opacity: state === 'thinking' ? [0.15, 0.3, 0.15] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: state === 'thinking' ? 2 : 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[#D4AF37] blur-[100px]"
        />

        {/* Core focal point */}
        <motion.div
           animate={{
             scale: state === 'revealing' ? [1, 1.2, 1] : 1,
             boxShadow: state === 'revealing' ? "0 0 100px 20px rgba(212, 175, 55, 0.2)" : "0 0 40px 5px rgba(212, 175, 55, 0.1)"
           }}
           className="w-2 h-2 bg-[#D4AF37] rounded-full relative z-10"
        />
      </div>

      {/* Floating Wisdom Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: "110%", opacity: 0 }}
          animate={{
            y: "-10%",
            opacity: [0, p.opacity, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{ width: p.size, height: p.size }}
          className="absolute bg-[#D4AF37] rounded-full blur-[1px]"
        />
      ))}

      {/* Subtle Depth Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
    </div>
  );
};

export default SagePresence;
