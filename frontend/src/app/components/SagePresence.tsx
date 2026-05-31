'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SacredGeometry = () => (
  <motion.svg
    viewBox="0 0 100 100"
    className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] opacity-[0.03] pointer-events-none"
    animate={{ rotate: 360 }}
    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    style={{ willChange: "transform" }}
  >
    <circle cx="50" cy="50" r="48" stroke="#D4AF37" fill="none" strokeWidth="0.1" />
    <circle cx="50" cy="50" r="30" stroke="#D4AF37" fill="none" strokeWidth="0.1" />
    <path d="M50 2 L50 98 M2 50 L98 50" stroke="#D4AF37" strokeWidth="0.1" />
    {[0, 45, 90, 135].map((angle) => (
      <line
        key={angle}
        x1="50" y1="50"
        x2={50 + 48 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 48 * Math.sin((angle * Math.PI) / 180)}
        stroke="#D4AF37"
        strokeWidth="0.05"
      />
    ))}
  </motion.svg>
);

const SagePresence = ({ state = 'idle' }: { state?: 'idle' | 'thinking' | 'revealing' | 'speaking' }) => {
  const [mounted, setMounted] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 10,
      size: Math.random() * 2 + 1
    }));
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden bg-[#050505]">
      <SacredGeometry />

      {/* Central Focal Orb */}
      <motion.div
        animate={{
          scale: state === 'thinking' ? [1, 1.1, 1] : [1, 1.03, 1],
          opacity: state === 'thinking' ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: state === 'thinking' ? 2 : 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-gradient-to-b from-[#D4AF37]/20 to-transparent blur-3xl"
        style={{ willChange: "transform, opacity" }}
      />

      {/* Floating Wisdom Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.x, y: "110%", opacity: 0 }}
          animate={{
            y: "-10%",
            opacity: [0, 0.3, 0],
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
    </div>
  );
};

export default SagePresence;
