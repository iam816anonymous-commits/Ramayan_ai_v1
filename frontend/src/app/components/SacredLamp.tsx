'use client';

import React from 'react';
import { motion } from 'framer-motion';

const SacredLamp = () => (
  <div className="relative w-12 h-16 flex items-center justify-center">
    {/* Lamp Body (Diya) */}
    <div className="absolute bottom-0 w-8 h-4 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full" />

    {/* The Flame */}
    <motion.div
      animate={{
        scale: [1, 1.1, 0.9, 1],
        opacity: [0.6, 0.8, 0.6, 0.7],
        y: [0, -1, 1, 0]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute bottom-4 w-3 h-8 bg-gradient-to-t from-orange-500 via-[#D4AF37] to-white rounded-full blur-[2px]"
    />

    {/* Inner Core */}
    <div className="absolute bottom-5 w-1 h-3 bg-white/80 rounded-full blur-[0.5px]" />

    {/* Outer Glow */}
    <motion.div
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.1, 0.3, 0.1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute bottom-4 w-10 h-10 bg-orange-400 rounded-full blur-xl"
    />
  </div>
);

export default SacredLamp;
