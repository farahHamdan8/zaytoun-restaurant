import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { categories, menuItems } from '../data/menuData';
import DishCard from './DishCard';
import CustomizationModal from './CustomizationModal';

export default function MenuSection() {
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedDish, setSelectedDish] = useState(null);

  const filteredDishes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return menuItems.filter((dish) => {
      const matchesCategory = activeCategory === 'all' || dish.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = `${dish.name.en} ${dish.name.ar} ${dish.description.en} ${dish.description.ar}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeCategory, query]);

  return (
    <section id="menu" className="border-t border-white/5 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs tracking-wide text-gold">{t('menu.eyebrow')}</span>
          <h2 className="mt-3 font-display text-4xl text-zinc-50 sm:text-5xl">{t('menu.title')}</h2>
          <p className="mt-3 text-zinc-400">{t('menu.subtitle')}</p>
        </div>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-md">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-zinc-900/60 px-4 py-3">
            <Search size={16} className="shrink-0 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('menu.searchPlaceholder')}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'border-gold bg-gold text-zinc-950'
                  : 'border-white/10 text-zinc-300 hover:border-gold/40 hover:text-gold'
              }`}
            >
              {t(cat.key)}
            </button>
          ))}
        </div>

        {/* Dish grid */}
        {filteredDishes.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-zinc-600">
              <UtensilsCrossed size={22} />
            </span>
            <p className="font-display text-xl text-zinc-200">{t('menu.noResultsTitle')}</p>
            <p className="text-sm text-zinc-500">{t('menu.noResultsSubtitle')}</p>
          </div>
        ) : (
          <motion.div layout className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onSelect={setSelectedDish} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <CustomizationModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
    </section>
  );
}
