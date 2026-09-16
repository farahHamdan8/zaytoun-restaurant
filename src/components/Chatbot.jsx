import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { quickChips, getBotResponse, getChipResponse } from '../data/chatbotData';

function makeMessage(sender, text) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, sender, text };
}

export default function Chatbot() {
  const { t, language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef(null);

  // Greet once, the first time the widget is opened, rather than on every
  // mount — keeps the panel from resetting if it's closed and reopened.
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([makeMessage('bot', t('chatbot.greeting'))]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, t]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const respond = (userText, resolver) => {
    setMessages((prev) => [...prev, makeMessage('user', userText)]);
    setIsTyping(true);
    // Small delay so the reply doesn't feel like a lookup table — it's
    // still fully client-side and instant under the hood.
    setTimeout(() => {
      setMessages((prev) => [...prev, makeMessage('bot', resolver())]);
      setIsTyping(false);
    }, 500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    respond(trimmed, () => getBotResponse(trimmed, language));
    setInput('');
  };

  const handleChipClick = (chip) => {
    respond(chip.label[language], () => getChipResponse(chip.id, language));
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t('chatbot.openLabel')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, delay: 0.5 }}
        className="fixed bottom-6 end-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-zinc-950 shadow-gold"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isOpen ? 'close' : 'open'}
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 45, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="fixed bottom-24 end-6 z-40 flex h-[32rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 bg-zinc-900/60 px-4 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Sparkles size={17} />
              </span>
              <div>
                <p className="font-display text-lg text-zinc-50">{t('chatbot.title')}</p>
                <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {t('chatbot.subtitle')}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm ${
                      msg.sender === 'user'
                        ? 'bg-gold text-zinc-950'
                        : 'border border-white/10 bg-zinc-900/70 text-zinc-100'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-zinc-900/70 px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-zinc-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 border-t border-white/5 px-4 py-3">
              {quickChips.map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {chip.label[language]}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/5 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chatbot.inputPlaceholder')}
                className="w-full rounded-full border border-white/10 bg-zinc-900/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50"
              />
              <button
                type="submit"
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-zinc-950 transition-transform hover:scale-105"
              >
                <Send size={15} className={isRTL ? '-scale-x-100' : ''} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
