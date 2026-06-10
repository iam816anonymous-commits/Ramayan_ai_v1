'use client';

import React from 'react';
import { motion } from 'framer-motion';

const DharmaGallery = () => {
  const lessons = [
    { title: "Duty", sanskrit: "Dharma", description: "The path of righteousness and cosmic order, exemplified by Rama's sacrifice." },
    { title: "Devotion", sanskrit: "Bhakti", description: "The unwavering love and service shown by Hanuman towards the Divine." },
    { title: "Truth", sanskrit: "Satya", description: "The adherence to one's word and the ultimate reality of existence." },
    { title: "Compassion", sanskrit: "Karuna", description: "The boundless mercy extended even to those who have faltered." },
    { title: "Sacrifice", sanskrit: "Tyaga", description: "The willing surrender of personal desires for the greater good of all." },
    { title: "Leadership", sanskrit: "Rajya", description: "The noble art of governing with justice, wisdom, and selfless service." }
  ];

  return (
    <section className="relative min-h-screen py-48 bg-[#0F0D0B] overflow-hidden stone-grain">
      {/* Mandala Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <div className="w-[800px] h-[800px] border border-[#FF9933] rounded-full animate-spin-slow" />
        <div className="absolute w-[600px] h-[600px] border border-[#FF9933] rounded-full animate-reverse-spin" />
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="text-center mb-40 space-y-8">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[11px] uppercase tracking-[1em] text-[#FF9933] font-cinzel block"
          >
            The Moral Foundation
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-5xl md:text-8xl font-cinzel tracking-widest uppercase text-[#FAF9F6] text-glow"
          >
            Dharma Gallery
          </motion.h2>
          <p className="text-xl font-cormorant italic text-[#8E8071] max-w-2xl mx-auto">
            Explore the eternal virtues that anchor the human soul in the turbulent seas of existence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {lessons.map((lesson, idx) => (
            <motion.div
              key={lesson.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              className="relative p-12 border border-[#FF9933]/10 bg-[#2C241E]/40 backdrop-blur-sm group hover:border-[#FF9933]/30 transition-all duration-1000 stone-grain"
            >
              <div className="absolute -top-6 left-12 px-6 bg-[#0F0D0B] text-[10px] tracking-[0.5em] text-[#FF9933]/40 font-cinzel uppercase group-hover:text-[#FFBF00] transition-colors">
                {lesson.sanskrit}
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel tracking-[0.3em] uppercase text-[#FAF9F6]">
                  {lesson.title}
                </h3>
                <p className="text-lg font-cormorant italic text-[#D9B99B] leading-relaxed">
                  {lesson.description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[#FF9933]/20 transition-all group-hover:w-full group-hover:h-full group-hover:opacity-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DharmaGallery;
