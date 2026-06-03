'use client';

import React, { useEffect, useState } from 'react';
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
  const [particles, setParticles] = useState<{id: number, x: string, duration: number, delay: number, size: number, opacity: number}[]>([]);
  const [orbitingOrbs, setOrbitingOrbs] = useState<{id: number, duration: number, radius: number, delay: number}[]>([]);

  useEffect(() => {
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + "%",
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 20,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    }));

    const generatedOrbs = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      duration: 40 + i * 20,
      radius: 200 + i * 50,
      delay: -i * 10
    }));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generatedParticles);
    setOrbitingOrbs(generatedOrbs);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden bg-[#050505]">
      <SacredGeometry />

      {/* Orbiting Wisdom Orbs */}
      {orbitingOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute w-[2px] h-[2px] bg-[#D4AF37] rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear",
            delay: orb.delay
          }}
          style={{
            width: orb.radius * 2,
            height: orb.radius * 2,
            border: '1px solid rgba(212, 175, 55, 0.03)',
            borderRadius: '50%',
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
            style={{ opacity: 0.2 }}
          />
        </motion.div>
      ))}

      {/* Central Focal Orb - Layered for Depth */}
      <div className="relative">
        <motion.div
          animate={{
            scale: state === 'thinking' ? [1, 1.2, 1] : [1, 1.05, 1],
            opacity: state === 'thinking' ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: state === 'thinking' ? 3 : 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[450px] h-[250px] md:h-[450px] rounded-full bg-[#D4AF37] blur-[120px]"
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          animate={{
            scale: state === 'thinking' ? [1, 1.1, 1] : [1, 1.03, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[700px] h-[400px] md:h-[700px] rounded-full bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-[#D4AF37]/5 blur-[80px]"
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
            scale: [0.3, 1, 0.3]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          style={{ width: p.size, height: p.size }}
          className="absolute bg-[#D4AF37] rounded-full blur-[0.5px]"
        />
      ))}
    </div>
  );
};

export default SagePresence;
