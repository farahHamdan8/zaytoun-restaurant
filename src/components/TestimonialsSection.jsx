import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { testimonials } from '../data/storyData';

const AUTOPLAY_MS = 6000;

export default function TestimonialsSection() {
  const { t, language, isRTL } = useLanguage();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => setIndex((prev) => (prev + 1) % testimonials.length), []);
  const goPrev = useCallback(() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const active = testimonials[index];
  // In RTL, "next" should still visually mean forward in reading direction —
  // flip which side each button slides in from.
  const enterX = isRTL ? -40 : 40;

  return (
    <section
      id="testimonials"
      className="border-t border-white/5 px-5 py-24 sm:px-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="text-xs tracking-wide text-gold">{t('testimonials.eyebrow')}</span>
        <h2 className="mt-3 font-display text-4xl text-zinc-50 sm:text-5xl">{t('testimonials.title')}</h2>
        <p className="mt-3 text-zinc-400">{t('testimonials.subtitle')}</p>

        <div className="relative mt-12">
          <Quote className="mx-auto mb-4 text-gold/30" size={32} />

          <div className="relative min-h-[190px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: enterX }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -enterX, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <p className="font-display text-2xl leading-relaxed text-zinc-100 sm:text-3xl">
                  "{active.text[language]}"
                </p>
                <div className="mt-5 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < active.rating ? 'currentColor' : 'none'}
                      strokeWidth={1.5}
                      className={i < active.rating ? 'text-[#ffab00]' : 'text-zinc-700'}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm font-medium text-zinc-400">{active.name[language]}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={goPrev}
              aria-label="Previous testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              {isRTL ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-gold' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              aria-label="Next testimonial"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              {isRTL ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
