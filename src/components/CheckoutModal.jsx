import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Banknote, CreditCard, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/restaurantInfo';

const EMPTY_FORM = { fullName: '', phone: '', address: '', city: '', paymentMethod: 'cash' };

function buildWhatsAppMessage({ items, form, totals, t, language, symbol }) {
  const lines = [];
  lines.push(`*${restaurantInfo.name[language]}* — ${t('checkout.title')}`);
  lines.push('—————————————');

  items.forEach((line) => {
    const parts = [`${line.quantity}x ${line.name[language]}`];
    if (line.customizations?.length) parts.push(`(${line.customizations.join(', ')})`);
    lines.push(parts.join(' '));
    if (line.notes) lines.push(`   "${line.notes}"`);
    lines.push(`   ${(line.price * line.quantity).toFixed(2)} ${symbol}`);
  });

  lines.push('—————————————');
  lines.push(`${t('cart.subtotal')}: ${totals.subtotal.toFixed(2)} ${symbol}`);
  lines.push(`${t('cart.deliveryFee')}: ${totals.deliveryFee.toFixed(2)} ${symbol}`);
  if (totals.tax > 0) lines.push(`${t('cart.tax')}: ${totals.tax.toFixed(2)} ${symbol}`);
  lines.push(`*${t('cart.total')}: ${totals.total.toFixed(2)} ${symbol}*`);
  lines.push('—————————————');
  lines.push(`${t('checkout.fullName')}: ${form.fullName}`);
  lines.push(`${t('checkout.phone')}: ${form.phone}`);
  lines.push(`${t('checkout.deliveryAddress')}: ${form.address}, ${form.city}`);
  lines.push(`${t('checkout.paymentMethod')}: ${t(`checkout.${form.paymentMethod}`)}`);

  return lines.join('\n');
}

export default function CheckoutModal() {
  const { t, language, isRTL } = useLanguage();
  const { items, subtotal, deliveryFee, tax, total, isCheckoutOpen, closeCheckout, clearCart } = useCart();
  const symbol = restaurantInfo.currencySymbol[language];

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form'); // 'form' | 'confirmed'

  // Start each checkout session on a clean form.
  useEffect(() => {
    if (isCheckoutOpen) {
      setForm(EMPTY_FORM);
      setErrors({});
      setStep('form');
    }
  }, [isCheckoutOpen]);

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    ['fullName', 'phone', 'address', 'city'].forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = t('checkout.requiredField');
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = buildWhatsAppMessage({
      items,
      form,
      totals: { subtotal, deliveryFee, tax, total },
      t,
      language,
      symbol,
    });

    const url = `https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setStep('confirmed');
  };

  const handleClose = () => {
    closeCheckout();
    if (step === 'confirmed') clearCart();
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
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
              aria-label={t('checkout.title')}
              className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-zinc-950 sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-5 py-5">
                <h2 className="font-display text-2xl text-zinc-50">{t('checkout.title')}</h2>
                <button
                  onClick={handleClose}
                  aria-label={t('common.close')}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:text-gold"
                >
                  <X size={16} />
                </button>
              </div>

              {step === 'confirmed' ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-14 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                    <CheckCircle2 size={28} />
                  </span>
                  <p className="font-display text-2xl text-zinc-50">{t('checkout.confirmedTitle')}</p>
                  <p className="text-sm text-zinc-400">{t('checkout.confirmedSubtitle')}</p>
                  <button
                    onClick={handleClose}
                    className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-zinc-950"
                  >
                    {t('checkout.backToSite')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5">
                  <h3 className="mb-3 text-sm font-semibold text-zinc-200">{t('checkout.contactInfo')}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <input
                        value={form.fullName}
                        onChange={updateField('fullName')}
                        placeholder={t('checkout.fullName')}
                        className={`w-full rounded-xl border bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                          errors.fullName ? 'border-red-500/60' : 'border-white/10'
                        }`}
                      />
                      {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
                    </div>
                    <div className="sm:col-span-1">
                      <input
                        value={form.phone}
                        onChange={updateField('phone')}
                        type="tel"
                        placeholder={t('checkout.phone')}
                        dir="ltr"
                        className={`w-full rounded-xl border bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                          errors.phone ? 'border-red-500/60' : 'border-white/10'
                        } ${isRTL ? 'text-end' : 'text-start'}`}
                      />
                      {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                    </div>
                  </div>

                  <h3 className="mb-3 mt-6 text-sm font-semibold text-zinc-200">{t('checkout.deliveryAddress')}</h3>
                  <div className="grid gap-3">
                    <div>
                      <input
                        value={form.address}
                        onChange={updateField('address')}
                        placeholder={t('checkout.addressPlaceholder')}
                        className={`w-full rounded-xl border bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                          errors.address ? 'border-red-500/60' : 'border-white/10'
                        }`}
                      />
                      {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                    </div>
                    <div>
                      <input
                        value={form.city}
                        onChange={updateField('city')}
                        placeholder={t('checkout.cityPlaceholder')}
                        className={`w-full rounded-xl border bg-zinc-900/60 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                          errors.city ? 'border-red-500/60' : 'border-white/10'
                        }`}
                      />
                      {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                    </div>
                  </div>

                  <h3 className="mb-3 mt-6 text-sm font-semibold text-zinc-200">{t('checkout.paymentMethod')}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'cash', label: t('checkout.cash'), Icon: Banknote },
                      { id: 'card', label: t('checkout.card'), Icon: CreditCard },
                    ].map(({ id, label, Icon }) => (
                      <label
                        key={id}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors ${
                          form.paymentMethod === id ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-zinc-400 hover:border-white/25'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={id}
                          checked={form.paymentMethod === id}
                          onChange={updateField('paymentMethod')}
                          className="sr-only"
                        />
                        <Icon size={18} strokeWidth={1.75} />
                        <span className="text-xs font-medium">{label}</span>
                      </label>
                    ))}
                  </div>

                  <h3 className="mb-3 mt-6 text-sm font-semibold text-zinc-200">{t('checkout.orderSummary')}</h3>
                  <div className="space-y-1.5 rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3.5 text-sm">
                    {items.map((line) => (
                      <div key={line.lineId} className="flex justify-between text-zinc-400">
                        <span>
                          {line.quantity}x {line.name[language]}
                        </span>
                        <span>{(line.price * line.quantity).toFixed(2)} {symbol}</span>
                      </div>
                    ))}
                    <div className="mt-2 flex justify-between border-t border-white/10 pt-2 font-display text-lg text-zinc-50">
                      <span>{t('cart.total')}</span>
                      <span className="text-gold">{total.toFixed(2)} {symbol}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-center text-xs text-zinc-500">{t('checkout.whatsappNote')}</p>

                  <button
                    type="submit"
                    className="mt-4 h-12 w-full rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
                  >
                    {t('checkout.placeOrder')}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
