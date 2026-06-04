'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Hero {
  name: string;
  sanskrit: string;
  role: string;
  virtues: string[];
  significance: string;
  relationships: string;
  description: string;
}

const CharacterExplorer = () => {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHeroes = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/heroes');
      if (response.ok) {
        const data = await response.json();
        setHeroes(data);
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const handleHeroSelect = (heroName: string) => {
    const hero = heroes.find(h => h.name.toLowerCase() === heroName.toLowerCase());
    if (hero) {
      setSelectedHero(hero);
    }
  };

  const renderRelationships = (relString: string) => {
    if (relString === "Ties of destiny are being revealed.") return relString;

    // Split by comma and process each part
    const parts = relString.split(', ');
    return parts.map((part, index) => {
      // Find the entity name in the part (usually at the end of "Relation of Name")
      const words = part.split(' ');
      const entityName = words[words.length - 1];
      const isKnownHero = heroes.some(h => h.name.toLowerCase() === entityName.toLowerCase());

      return (
        <React.Fragment key={index}>
          {isKnownHero ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHeroSelect(entityName);
              }}
              className="text-[#D4AF37] hover:underline underline-offset-4 decoration-[#D4AF37]/40"
            >
              {part}
            </button>
          ) : (
            <span>{part}</span>
          )}
          {index < parts.length - 1 ? ', ' : ''}
        </React.Fragment>
      );
    });
  };

  if (loading) return null;

  return (
    <section className="relative min-h-screen py-48 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#D4AF3705_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-10 relative z-10">
        <div className="text-center mb-40 space-y-8">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="text-[11px] uppercase tracking-[1.2em] text-[#D4AF37] font-cinzel block"
          >
            Gallery of Icons
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-[8rem] font-cinzel tracking-widest uppercase text-[#F2EAD8]"
          >
            Hall of Heroes
          </motion.h2>
          <div className="w-24 h-[1px] bg-[#D4AF37]/20 mx-auto mt-20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-24">
          {heroes.map((hero, idx) => (
            <motion.div
              key={hero.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 1.5 }}
              onClick={() => setSelectedHero(hero)}
              className="relative group cursor-pointer"
            >
              <div className="aspect-[3/4] overflow-hidden border border-[#D4AF37]/10 bg-[#11100D]/40 backdrop-blur-sm transition-all duration-1000 group-hover:border-[#D4AF37]/40 p-12 flex flex-col items-center justify-center text-center space-y-12">
                <div className="absolute top-10 left-10 text-6xl font-serif text-[#D4AF37]/5 group-hover:text-[#D4AF37]/10 transition-colors">
                  {hero.sanskrit}
                </div>

                <div className="space-y-4">
                  <h3 className="text-4xl font-cinzel tracking-widest uppercase text-[#F2EAD8] group-hover:text-[#D4AF37] transition-colors">
                    {hero.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/40 block">
                    {hero.role}
                  </span>
                </div>

                <div className="flex flex-wrap justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
                  {hero.virtues.map((v, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-[0.2em] border border-[#D4AF37]/20 px-3 py-1 text-[#B7AA92]">
                      {v}
                    </span>
                  ))}
                </div>

                <div className="absolute inset-6 border border-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedHero && (
          <motion.div
            key={selectedHero.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-10 bg-[#050505]/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-6xl w-full h-full max-h-[80vh] overflow-y-auto bg-[#11100D] border border-[#D4AF37]/20 relative flex flex-col md:flex-row scrollbar-hide"
            >
              <button
                onClick={() => setSelectedHero(null)}
                className="absolute top-10 right-10 z-20 text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
              >
                [ Return to Hall ]
              </button>

              <div className="w-full md:w-1/3 h-64 md:h-full border-b md:border-b-0 md:border-r border-[#D4AF37]/10 flex flex-col items-center justify-center p-20 text-center space-y-10">
                <span className="text-8xl md:text-[10rem] font-serif text-[#D4AF37]/10">{selectedHero.sanskrit}</span>
                <h2 className="text-5xl md:text-7xl font-cinzel tracking-widest uppercase text-[#F2EAD8]">{selectedHero.name}</h2>
                <div className="w-12 h-[1px] bg-[#D4AF37]/30" />
                <span className="text-[11px] uppercase tracking-[0.6em] text-[#D4AF37]">{selectedHero.role}</span>
              </div>

              <div className="w-full md:w-2/3 p-12 md:p-24 flex flex-col justify-center space-y-16">
                <div className="space-y-8">
                  <h4 className="text-[12px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">The Divine Significance</h4>
                  <p className="text-3xl md:text-4xl font-cormorant italic text-[#F2EAD8] leading-snug">
                    &ldquo;{selectedHero.significance}&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <h4 className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">Core Virtues</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedHero.virtues.map((v, i) => (
                        <span key={i} className="text-[11px] uppercase tracking-[0.3em] font-cinzel text-[#E6CF9B] px-4 py-2 border border-[#D4AF37]/10">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">Ties of Destiny</h4>
                    <p className="text-lg font-cormorant italic text-[#B7AA92]">{renderRelationships(selectedHero.relationships)}</p>
                  </div>
                </div>

                <div className="space-y-8 pt-10 border-t border-[#D4AF37]/10">
                  <h4 className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">Legend & Lore</h4>
                  <p className="text-xl md:text-2xl font-cormorant italic text-[#B7AA92] leading-relaxed">
                    {selectedHero.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CharacterExplorer;
