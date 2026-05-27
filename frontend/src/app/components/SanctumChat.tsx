'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'sage';
  content: string;
}

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/sanctum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'sage', content: data.formatted_response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'sage', content: "### Error\nThe connection to the Sanctum has been interrupted." }]);
    } finally {
      setLoading(false);
    }
  };

  const parseSageContent = (content: string) => {
    const sections = content.split('### ').filter(Boolean);
    return sections.map(section => {
      const [title, ...body] = section.split('\n');
      return { title: title.trim(), body: body.join('\n').trim() };
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-[#d4af37] font-serif p-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl tracking-widest uppercase mb-2">Ramayana AI</h1>
        <p className="text-sm opacity-60 italic">Sit. Ask. Reflect.</p>
      </header>

      <main className="flex-1 overflow-y-auto max-w-3xl mx-auto w-full space-y-12 scrollbar-hide pb-20">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            >
              {msg.role === 'user' ? (
                <span className="inline-block opacity-40 text-sm italic border-b border-[#d4af37]/20 pb-1">
                  &ldquo;{msg.content}&rdquo;
                </span>
              ) : (
                <div className="space-y-6 border-l border-[#d4af37]/30 pl-8 py-2">
                  {parseSageContent(msg.content).map((section, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.2 }}
                    >
                      <h3 className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-2">{section.title}</h3>
                      <p className="text-lg leading-relaxed opacity-90">{section.body}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="text-center opacity-30 italic animate-pulse">Communicating with the Sage...</div>
        )}
      </main>

      <footer className="mt-8 max-w-3xl mx-auto w-full relative">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the Sage..."
            className="w-full bg-transparent border-b border-[#d4af37]/50 py-4 px-2 focus:outline-none focus:border-[#d4af37] transition-colors placeholder:text-[#d4af37]/30 text-lg"
          />
        </form>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 text-[10px] tracking-widest uppercase">
          Enter to Reflect
        </div>
      </footer>
    </div>
  );
};

export default SanctumChat;
