import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/restaurantInfo';

export default function CustomizationModal({ dish, onClose }) {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const symbol = restaurantInfo.currencySymbol[language];

  const hasSpice = Boolean(dish?.spiceLevels?.length);
  const hasToppings = Boolean(dish?.toppings?.length);

  const [spiceLevel, setSpiceLevel] = useState(hasSpice ? dish.spiceLevels[Math.floor(dish.spiceLevels.length / 2)] : null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const toppingsExtra = useMemo(() => {
    if (!hasToppings) return 0;
    return dish.toppings
      .filter((tp) => selectedToppings.includes(tp.id))
      .reduce((sum, tp) => sum + tp.price, 0);
  }, [dish, hasToppings, selectedToppings]);

  const unitPrice = (dish?.price ?? 0) + toppingsExtra;
  const total = unitPrice * quantity;

  const toggleTopping = (id) => {
    setSelectedToppings((prev) => (prev.includes(id) ? prev.filter((toppingId) => toppingId !== id) : [...prev, id]));
  };

  const handleAdd = () => {
    const customizations = [];
    if (hasSpice) customizations.push(t(`spiceLevels.${spiceLevel}`));
    if (hasToppings) {
      dish.toppings
        .filter((tp) => selectedToppings.includes(tp.id))
        .forEach((tp) => customizations.push(tp.label[language]));
    }

    addItem(
      { id: dish.id, name: dish.name, price: unitPrice, image: dish.image },
      { quantity, customizations, notes: notes.trim() }
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {dish && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label={t('customize.title')}
              className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950 sm:rounded-3xl"
            >
              {/* Header image */}
              <div className="relative h-44 shrink-0">
                <img src={dish.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <button
                  onClick={onClose}
                  aria-label={t('common.close')}
                  className="absolute top-3 end-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-950/60 text-zinc-100 backdrop-blur-md"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 start-4 end-4">
                  <p className="font-display text-2xl text-zinc-50">{dish.name[language]}</p>
                </div>
              </div>

              {/* Scrollable options */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <p className="text-sm text-zinc-400">{dish.description[language]}</p>

                {hasSpice && (
                  <div className="mt-6">
                    <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-zinc-200">
                      <Flame size={14} className="text-orange-400" />
                      {t('customize.spiceLevel')}
                    </h4>
                    <div className="flex gap-2">
                      {dish.spiceLevels.map((level) => (
                        <button
                          key={level}
                          onClick={() => setSpiceLevel(level)}
                          className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                            spiceLevel === level
                              ? 'border-gold bg-gold/10 text-gold'
                              : 'border-white/10 text-zinc-400 hover:border-white/25'
                          }`}
                        >
                          {t(`spiceLevels.${level}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasToppings && (
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-zinc-200">{t('customize.extras')}</h4>
                    <div className="space-y-2">
                      {dish.toppings.map((tp) => (
                        <label
                          key={tp.id}
                          className={`flex cursor-pointer items-center justify-between rounded-xl border px-3.5 py-3 transition-colors ${
                            selectedToppings.includes(tp.id)
                              ? 'border-gold/50 bg-gold/5'
                              : 'border-white/10 hover:border-white/25'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedToppings.includes(tp.id)}
                              onChange={() => toggleTopping(tp.id)}
                              className="h-4 w-4 rounded accent-gold"
                            />
                            <span className="text-sm text-zinc-200">{tp.label[language]}</span>
                          </span>
                          <span className="text-sm text-zinc-500">
                            +{tp.price} {symbol}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="mb-3 text-sm font-semibold text-zinc-200">{t('customize.instructions')}</h4>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('customize.instructionsPlaceholder')}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50"
                  />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-zinc-200">{t('customize.quantity')}</h4>
                  <div className="flex items-center gap-3 rounded-full border border-white/10 px-1.5">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-gold"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-5 text-center text-sm text-zinc-100">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="flex h-8 w-8 items-center justify-center text-zinc-300 hover:text-gold"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="shrink-0 border-t border-white/5 p-5">
                <button
                  onClick={handleAdd}
                  className="flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
                >
                  {t('customize.addForPrice')} {total.toFixed(2)} {symbol}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
