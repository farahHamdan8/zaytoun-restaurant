import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast } = useCart();
  const { language, isRTL } = useLanguage();

  const enterX = isRTL ? -24 : 24;

  return (
    <div className="pointer-events-none fixed bottom-6 inset-x-0 z-[80] flex justify-center sm:justify-end sm:pe-6">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, x: enterX }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-zinc-900/95 px-4 py-3 shadow-gold backdrop-blur-md"
          >
            <CheckCircle2 size={18} className="shrink-0 text-gold" />
            <p className="text-sm text-zinc-100">
              <span className="font-medium">{toast.message[language]}</span>{' '}
              <span className="text-zinc-400">
                {language === 'ar' ? 'أُضيف إلى الطلب' : 'added to your order'}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
