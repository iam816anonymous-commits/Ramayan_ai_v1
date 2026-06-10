'use client';

import React, { useState, useEffect } from 'react';
import HomeSanctum from './components/HomeSanctum';
import SacredCourtyard from './components/SacredCourtyard';
import Timeline from './components/Timeline';
import CharacterExplorer from './components/CharacterExplorer';
import ShlokaLibrary from './components/ShlokaLibrary';
import DharmaGallery from './components/DharmaGallery';
import SanctumChat from './components/SanctumChat';
import SupportingSpaces from './components/SupportingSpaces';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0F0D0B] text-[#D9B99B] font-inter selection:bg-[#FF9933]/20 selection:text-[#FAF9F6] overflow-x-hidden stone-grain">
      {/*
        The Digital Pilgrimage Architecture (V3)
        Linear Flow: Gate -> Courtyard -> Journey -> Heroes -> Archive -> Gallery -> Inquiry
      */}

      {/* SECTION 1: THE GATE OF AYODHYA */}
      <section id="gate" className="relative min-h-screen">
        <HomeSanctum />
      </section>

      {/* SECTION 2: THE SACRED COURTYARD */}
      <section id="courtyard" className="relative">
        <SacredCourtyard />
      </section>

      {/* SECTION 3: THE JOURNEY OF THE EPIC (Timeline) */}
      <section id="journey" className="relative">
        <Timeline />
      </section>

      {/* SECTION 4: HALL OF HEROES (Characters) */}
      <section id="heroes" className="relative">
        <CharacterExplorer />
      </section>

      {/* SECTION 5: WISDOM ARCHIVE (Library) */}
      <section id="archive" className="relative">
        <ShlokaLibrary />
      </section>

      {/* SECTION 6: DHARMA GALLERY */}
      <section id="dharma" className="relative">
        <DharmaGallery />
      </section>

      {/* SECTION 7: THE INQUIRY HALL & INNER SANCTUM (Chat) */}
      <section id="inquiry" className="relative min-h-screen">
        <SanctumChat />
      </section>

      {/* SECTION 8: FINAL REFLECTIONS */}
      <section id="about" className="relative">
        <SupportingSpaces view="about" />
      </section>

      {/* Simple Floating Progress Indicator */}
      <div className="fixed bottom-12 right-12 z-50 flex flex-col items-center gap-4 hidden lg:flex">
         <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#FF9933]/20 to-[#FF9933]/40" />
         <span className="text-[10px] uppercase tracking-[0.4em] font-cinzel text-[#FF9933]/60 rotate-90 origin-right translate-x-4">
           The Pilgrimage
         </span>
      </div>
    </main>
  );
}
