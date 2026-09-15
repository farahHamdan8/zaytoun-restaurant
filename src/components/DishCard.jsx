import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Flame, Leaf, Crown, Plus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';

const TAG_META = {
  spicy: { icon: Flame, className: 'text-orange-400 bg-orange-400/10 border-orange-400/30' },
  vegan: { icon: Leaf, className: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  bestseller: { icon: Crown, className: 'text-gold bg-gold/10 border-gold/30' },
};

const DishCard = forwardRef(({ dish, onSelect }, ref) => {
  const { t, language } = useLanguage();
  const symbol = restaurantInfo.currencySymbol[language];

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-zinc-900/60 transition-colors hover:border-gold/30"
    >
      <button
        onClick={() => onSelect(dish)}
        className="relative block aspect-[4/3] w-full overflow-hidden text-start"
        aria-label={dish.name[language]}
      >
        <img
          src={dish.image}
          alt={dish.name[language]}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

        {dish.tags?.length > 0 && (
          <div className="absolute top-3 start-3 flex flex-wrap gap-1.5">
            {dish.tags.map((tagId) => {
              const meta = TAG_META[tagId];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <span
                  key={tagId}
                  className={`flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium backdrop-blur-sm ${meta.className}`}
                >
                  <Icon size={11} strokeWidth={2} />
                  {t(`tags.${tagId}`)}
                </span>
              );
            })}
          </div>
        )}

        <span className="absolute top-3 end-3 flex items-center gap-1 rounded-full border border-white/15 bg-zinc-950/70 px-2 py-1 text-[11px] font-medium text-zinc-100 backdrop-blur-sm">
          <Star size={11} fill="currentColor" strokeWidth={0} className="text-gold" />
          {dish.rating.toFixed(1)}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl leading-snug text-zinc-50">{dish.name[language]}</h3>
          <span className="shrink-0 font-display text-lg text-gold">
            {dish.price} {symbol}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-zinc-400">{dish.description[language]}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Clock size={13} strokeWidth={1.75} />
            {dish.prepTime} {t('menu.minutes')}
          </span>

          <button
            onClick={() => onSelect(dish)}
            className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3.5 py-2 text-xs font-semibold text-gold transition-colors hover:bg-gold hover:text-zinc-950"
          >
            <Plus size={13} strokeWidth={2.5} />
            {t('common.addToOrder')}
          </button>
        </div>
      </div>
    </motion.article>
  );
});

DishCard.displayName = 'DishCard';

export default DishCard;