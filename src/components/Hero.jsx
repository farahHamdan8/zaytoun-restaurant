import { motion } from 'framer-motion';
import { Star, Clock, UtensilsCrossed, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';

// One orchestrated reveal on load, staggered across children — deliberately
// not repeated as a per-section scroll animation elsewhere.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

function StatBadge({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3 backdrop-blur-md">
      <span className="text-gold">{icon}</span>
      <div className="leading-tight">
        <p className="font-display text-xl text-zinc-50">{value}</p>
        <p className="text-xs text-zinc-400">{label}</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const { t, language } = useLanguage();

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="home" className="relative flex min-h-screen items-center overflowX-hidden pt-20">
      {/* Backdrop: dish photography, replace src with real restaurant photography */}
      <div className="absolute inset-0 ">
        <img
          src="https://images.unsplash.com/photo-1608816042754-d69cb2271bea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTE1fHxyZXN0YXVyYW50fGVufDB8fDB8fHww"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
        <div className="absolute inset-0 bg-radial-fade" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center sm:px-8"
      >
        <motion.span
          variants={item}
          className="mb-6 rounded-full border border-gold/30 px-4 py-1.5 text-xs tracking-wide text-gold"
        >
          {t('hero.eyebrow')}
        </motion.span>

        <motion.h1 variants={item} className="font-display text-5xl leading-[1.1] text-zinc-50 sm:text-6xl md:text-7xl">
          {t('hero.titleLine1')}
          <br />
          <span className="text-gold">{t('hero.titleLine2')}</span>
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-balance text-base text-zinc-300 sm:text-lg">
          {t('hero.subtitle')}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button 
            onClick={() => scrollTo('#menu')}
            className="h-12 rounded-full bg-gold px-8  text-zinc-950 shadow-gold transition-transform hover:scale-[1.03]"
          >
            {t('hero.viewMenu')}
          </button>
          <button
            onClick={() => scrollTo('#menu')}
            className="h-12 rounded-full border border-white/15 px-8  text-zinc-100 backdrop-blur-md transition-colors hover:border-gold/10 hover:text-gold"
          >
            {t('hero.orderDelivery')}
          </button>
        </motion.div>

        <motion.div variants={item} className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatBadge
            icon={<Star size={18} fill="currentColor" strokeWidth={0} />}
            value={restaurantInfo.rating.toFixed(1)}
            label={t('hero.ratingLabel')}
          />
          <StatBadge
            icon={<Clock size={18} strokeWidth={1.75} />}
            value={`${restaurantInfo.yearsOfExperience}+`}
            label={t('hero.experienceLabel')}
          />
          <StatBadge
            icon={<UtensilsCrossed size={18} strokeWidth={1.75} />}
            value={`${restaurantInfo.signatureDishCount}+`}
            label={t('hero.dishesLabel')}
          />
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollTo('#menu')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        aria-label="Scroll to menu"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 transition-colors hover:text-gold"
      >
        <ChevronDown size={22} />
      </motion.button>
    </section>
  );
}
