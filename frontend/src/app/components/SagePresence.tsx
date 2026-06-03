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

  const [particles, setParticles] = useState<Array<{
    id: number,
    x: string,
    duration: number,
    delay: number,
    size: number,
    opacity: number
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      duration: Math.random() * 40 + 30,
      delay: Math.random() * 20,
      size: Math.random() * 1.2 + 0.4,
      opacity: Math.random() * 0.3 + 0.05
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(newParticles);
    setMounted(true);
  }, []);

  const rings = useMemo(() => [
    { id: 1, size: 300, duration: 15, opacity: 0.1 },
    { id: 2, size: 500, duration: 25, opacity: 0.05 },
    { id: 3, size: 800, duration: 40, opacity: 0.02 },
  ], []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden bg-[#080705]">
      {/* Background Sacred Geometry */}
      <SacredGeometry />

      {/* Breathing Aura Rings */}
      <div className="relative flex items-center justify-center">
        {rings.map((ring) => (
          <motion.div
            key={ring.id}
            className="absolute rounded-full border border-[#C9A86A]"
            style={{
              width: ring.size,
              height: ring.size,
              opacity: ring.opacity
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [ring.opacity, ring.opacity * 2, ring.opacity],
              rotate: ring.id % 2 === 0 ? 360 : -360
            }}
            transition={{
              duration: state === 'thinking' ? ring.duration / 2 : ring.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Central Divine Presence */}
        <motion.div
          className="absolute w-64 h-64 rounded-full bg-[#C9A86A] blur-[120px]"
          animate={{
            scale: state === 'thinking' ? [1, 1.4, 1] : [1, 1.1, 1],
            opacity: state === 'thinking' ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: state === 'thinking' ? 4 : 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Soft Core Light */}
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-[#E6CF9B] blur-[60px]"
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Atmospheric Wisdom Particles */}
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
          className="absolute bg-[#E6CF9B] rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
};

export default SagePresence;
