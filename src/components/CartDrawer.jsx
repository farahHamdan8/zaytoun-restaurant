import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/restaurantInfo';

function formatPrice(value, language) {
  const symbol = restaurantInfo.currencySymbol[language];
  return `${value.toFixed(2)} ${symbol}`;
}

function CartLine({ line }) {
  const { language } = useLanguage();
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      className="flex gap-3 border-b border-white/5 py-4"
    >
      <img
        src={line.image}
        alt=""
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-zinc-100">{line.name[language]}</p>
          <button
            onClick={() => removeItem(line.lineId)}
            aria-label="Remove item"
            className="text-zinc-500 transition-colors hover:text-red-400"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {line.customizations?.length > 0 && (
          <p className="mt-0.5 text-xs text-zinc-500">{line.customizations.join(' · ')}</p>
        )}
        {line.notes && <p className="mt-0.5 text-xs italic text-zinc-600">"{line.notes}"</p>}

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-white/10 px-1">
            <button
              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-7 w-7 items-center justify-center text-zinc-300 hover:text-gold"
            >
              <Minus size={13} />
            </button>
            <span className="w-4 text-center text-sm text-zinc-100">{line.quantity}</span>
            <button
              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-7 w-7 items-center justify-center text-zinc-300 hover:text-gold"
            >
              <Plus size={13} />
            </button>
          </div>
          <span className="font-display text-lg text-gold">
            {formatPrice(line.price * line.quantity, language)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}

export default function CartDrawer() {
  const { t, language, isRTL } = useLanguage();
  const { items, subtotal, deliveryFee, tax, total, isCartOpen, closeCart, openCheckout } = useCart();

  const offscreenX = isRTL ? '-100%' : '100%';

  const handleBrowseMenu = () => {
    closeCart();
    
    // مهلة زمنية بسيطة لضمان إغلاق الـ Drawer وتحرير الـ Scroll Lock
    setTimeout(() => {
      const menuSection = document.getElementById('menu') || document.querySelector('#menu');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: offscreenX }}
            animate={{ x: 0 }}
            exit={{ x: offscreenX }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            role="dialog"
            aria-label={t('cart.title')}
            className="fixed inset-y-0 end-0 z-[70] flex w-full max-w-md flex-col border-s border-white/10 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
              <h2 className="font-display text-2xl text-zinc-50">{t('cart.title')}</h2>
              <button
                onClick={closeCart}
                aria-label={t('common.close')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:text-gold"
              >
                <X size={16} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 text-zinc-600">
                  <ShoppingBag size={22} />
                </span>
                <p className="font-display text-xl text-zinc-200">{t('cart.empty')}</p>
                <p className="text-sm text-zinc-500">{t('cart.emptySubtitle')}</p>
                <button
                  onClick={handleBrowseMenu}
                  className="mt-3 rounded-full border border-gold/40 px-5 py-2 text-sm text-gold hover:bg-gold/10"
                >
                  {t('cart.browseMenu')}
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {items.map((line) => (
                      <CartLine key={line.lineId} line={line} />
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-white/5 px-5 py-5">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-zinc-400">
                      <span>{t('cart.subtotal')}</span>
                      <span>{formatPrice(subtotal, language)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>{t('cart.deliveryFee')}</span>
                      <span>{formatPrice(deliveryFee, language)}</span>
                    </div>
                    {tax > 0 && (
                      <div className="flex justify-between text-zinc-400">
                        <span>{t('cart.tax')}</span>
                        <span>{formatPrice(tax, language)}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-display text-lg text-zinc-50">
                      <span>{t('cart.total')}</span>
                      <span className="text-gold">{formatPrice(total, language)}</span>
                    </div>
                  </div>

                  <button
                    onClick={openCheckout}
                    className="mt-5 h-12 w-full rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
                  >
                    {t('cart.checkout')}
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}