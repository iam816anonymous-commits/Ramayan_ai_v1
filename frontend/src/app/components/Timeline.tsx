import React from 'react';

const events = [
  { kanda: "Bala Kanda", title: "The Divine Birth", desc: "The birth of Rama and his brothers in Ayodhya." },
  { kanda: "Ayodhya Kanda", title: "The Great Exile", desc: "Rama departs for the forest to fulfill his father's promise." },
  { kanda: "Aranya Kanda", title: "The Forest Dwellers", desc: "Life in the Dandaka forest and the abduction of Sita." },
  { kanda: "Kishkindha Kanda", title: "The Monkey Alliance", desc: "Rama meets Hanuman and alliances with Sugriva." },
  { kanda: "Sundara Kanda", title: "Hanuman's Leap", desc: "Hanuman crosses the ocean and finds Sita in Lanka." },
  { kanda: "Yuddha Kanda", title: "The Great War", desc: "The battle against Ravana and the rescue of Sita." },
];

const Timeline = () => {
  return (
    <div className="py-20 bg-[#050505] text-[#d4af37]">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl text-center mb-16 tracking-widest font-serif">THE JOURNEY</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
            <div key={i} className="group p-6 border border-[#d4af37]/10 hover:border-[#d4af37]/40 transition-all cursor-pointer bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
              <span className="text-[10px] uppercase tracking-widest opacity-50 mb-2 block">{event.kanda}</span>
              <h3 className="text-xl mb-3 font-serif">{event.title}</h3>
              <p className="text-sm opacity-60 leading-relaxed font-serif italic">{event.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
