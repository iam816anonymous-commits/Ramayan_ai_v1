'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check } from 'lucide-react';
import SagePresence from './SagePresence';

interface Message {
  role: 'user' | 'sage';
  content: {
    revelation?: {
      reflection: string;
      meaning: string;
      context: string;
      takeaway: string;
    };
    reflection?: string;
    meaning?: string;
    context?: string;
    takeaway?: string;
    source_verse?: string;
    meta?: {
      verses?: string[];
      sources?: string[];
      entities?: {
        characters?: string[];
      };
    };
  };
  intent?: string;
  id: string;
}

const SanctumChat = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: { meaning: query }, id: Date.now().toString() };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setQuery('');

    try {
      const response = await fetch('http://localhost:8000/api/sanctum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.content.meaning }),
      });
      const data = await response.json();

      const sageMessage: Message = {
        role: 'sage',
        content: data,
        intent: data.intent,
        id: (Date.now() + 1).toString()
      };
      setMessages(prev => [...prev, sageMessage]);

      // Emit custom event if a source verse is found to update the Shloka Library
      if (data.source_verse && data.source_verse !== "N/A") {
        const event = new CustomEvent('revelation-shloka', {
          detail: {
            verse: data.meta?.verses?.[0] || "1.1.1",
            context: data.meta?.kanda || "Universal",
            text: data.source_verse,
            translation: data.revelation?.meaning || data.meaning,
            explanation: data.revelation?.takeaway || data.takeaway
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.error("The Sage is silent...", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center overflow-hidden">
      {/* SECTION 7: THE INQUIRY HALL */}
      <div className="w-full max-w-7xl mx-auto px-10 pt-48 pb-32 flex flex-col items-center">

        {/* Ceremonial Altar Design for Inquiry */}
        <AnimatePresence mode="wait">
          {messages.length === 0 && !loading ? (
            <motion.div
              key="altar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col items-center space-y-20"
            >
              <div className="text-center space-y-8">
                <span className="text-[11px] uppercase tracking-[1.2em] text-[#D4AF37] font-cinzel block opacity-60">
                  Offering of Inquiry
                </span>
                <h2 className="text-5xl md:text-[8rem] font-cinzel tracking-widest uppercase text-[#F2EAD8]">
                  The Inquiry Hall
                </h2>
                <div className="w-24 h-[1px] bg-[#D4AF37]/20 mx-auto mt-12" />
              </div>

              <div className="w-full max-w-4xl relative group">
                <div className="absolute -inset-10 border border-[#D4AF37]/5 rounded-full blur-2xl group-hover:border-[#D4AF37]/10 transition-all duration-1000" />

                <form onSubmit={handleSubmit} className="relative">
                   <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="What wisdom do you seek today?"
                    className="w-full bg-[#11100D]/60 border-y border-[#D4AF37]/20 px-12 py-16 text-2xl md:text-4xl font-cormorant italic text-[#F2EAD8] placeholder:text-[#D4AF37]/20 focus:outline-none focus:border-[#D4AF37]/40 transition-all resize-none h-64 text-center"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }}
                   />
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      <button
                        type="submit"
                        className="px-16 py-6 bg-[#D4AF37] text-[#050505] text-[11px] uppercase tracking-[0.8em] font-cinzel hover:bg-[#F2EAD8] transition-all shadow-[0_0_50px_rgba(212,175,55,0.2)]"
                      >
                        Seek Revelation
                      </button>
                   </div>
                </form>
              </div>

              <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center opacity-30">
                 {["Contemplate", "Inquire", "Receive"].map(step => (
                   <div key={step} className="space-y-4">
                      <div className="w-2 h-2 bg-[#D4AF37] rounded-full mx-auto" />
                      <span className="text-[10px] uppercase tracking-[0.4em] font-cinzel text-[#D4AF37]">{step}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          ) : (
            /* SECTION 8: INNER SANCTUM - Response View */
            <motion.div
              key="sanctum"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full max-w-6xl space-y-32 pb-40"
            >
               {messages.map((msg) => (
                 <div key={msg.id} className="w-full">
                    {msg.role === 'user' ? (
                      <div className="text-center space-y-10 opacity-60">
                         <span className="text-[11px] uppercase tracking-[0.8em] text-[#D4AF37] font-cinzel block">The Seeker Asks</span>
                         <h3 className="text-3xl md:text-5xl font-cormorant italic text-[#F2EAD8]">&ldquo;{msg.content.meaning}&rdquo;</h3>
                         <div className="w-12 h-[1px] bg-[#D4AF37]/20 mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-32">
                         <div className="space-y-24">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 1.5 }}
                              className="text-center space-y-8"
                            >
                               <span className="text-[11px] uppercase tracking-[1em] text-[#D4AF37] font-cinzel block">The Sage Reflects</span>
                               <p className="text-2xl md:text-4xl font-cormorant italic text-[#F2EAD8] leading-relaxed max-w-4xl mx-auto">
                                 {msg.content.revelation?.reflection || msg.content.reflection}
                               </p>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1, duration: 2 }}
                              className="relative p-16 md:p-24 border border-[#D4AF37]/10 bg-[#11100D]/40 backdrop-blur-xl"
                            >
                               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-10 bg-[#050505] text-[10px] tracking-[0.6em] text-[#D4AF37] font-cinzel uppercase">
                                 The Meaning
                               </div>

                               <p className="text-xl md:text-3xl font-cormorant italic text-[#B7AA92] leading-relaxed text-center">
                                 {msg.content.revelation?.meaning || msg.content.meaning}
                               </p>

                               <button
                                 onClick={() => handleCopy(msg.content.revelation?.meaning || msg.content.meaning || '')}
                                 className="absolute bottom-6 right-6 p-3 text-[#D4AF37]/20 hover:text-[#D4AF37] transition-all"
                                 aria-label="Copy Revelation"
                               >
                                 {copied ? <Check size={18} /> : <Copy size={18} />}
                               </button>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                               <motion.div
                                 initial={{ opacity: 0, x: -20 }}
                                 whileInView={{ opacity: 1, x: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ delay: 2 }}
                                 className="p-12 border border-[#D4AF37]/5 space-y-6"
                               >
                                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 font-cinzel">Scriptural Context</h4>
                                  <p className="text-lg font-cormorant italic text-[#B7AA92] leading-relaxed">
                                    {msg.content.revelation?.context || msg.content.context}
                                  </p>
                               </motion.div>

                               <motion.div
                                 initial={{ opacity: 0, x: 20 }}
                                 whileInView={{ opacity: 1, x: 0 }}
                                 viewport={{ once: true }}
                                 transition={{ delay: 2.2 }}
                                 className="p-12 border border-[#D4AF37]/5 space-y-6"
                               >
                                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]/40 font-cinzel">The Takeaway</h4>
                                  <p className="text-lg font-cormorant italic text-[#E6CF9B] leading-relaxed">
                                    {msg.content.revelation?.takeaway || msg.content.takeaway}
                                  </p>
                               </motion.div>
                            </div>
                         </div>

                         {msg.content.source_verse && msg.content.source_verse !== "N/A" && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: 3 }}
                              className="w-full text-center space-y-12 pt-20 border-t border-[#D4AF37]/10"
                            >
                               <span className="text-[10px] uppercase tracking-[0.8em] text-[#D4AF37]/40 font-cinzel">The Eternal Verse</span>
                               <h4 className="text-3xl md:text-5xl font-serif text-[#F2EAD8] leading-relaxed max-w-5xl mx-auto">
                                 {msg.content.source_verse}
                               </h4>
                            </motion.div>
                         )}

                         <div className="flex justify-center pt-20">
                            <button
                              onClick={() => setMessages([])}
                              className="text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]/40 hover:text-[#D4AF37] transition-all border border-[#D4AF37]/10 px-10 py-4"
                            >
                               Offer Another Inquiry
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
               ))}

               {loading && (
                 <div className="flex flex-col items-center space-y-12 animate-pulse">
                    <Sparkles className="text-[#D4AF37] opacity-20" size={48} />
                    <span className="text-[10px] uppercase tracking-[1em] text-[#D4AF37]/40 font-cinzel">The Sage Contemplates...</span>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
         <SagePresence state={loading ? 'thinking' : 'idle'} />
      </div>
    </div>
  );
};

export default SanctumChat;
