import { AnimatePresence, motion } from 'framer-motion';
import { X, CalendarCheck, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';

function buildReservationMessage(booking, t, language) {
  const lines = [
    `*${restaurantInfo.name[language]}* — ${t('reservation.title')}`,
    '—————————————',
    `${t('reservation.bookingRef')}: ${booking.bookingRef}`,
    `${t('reservation.fullName')}: ${booking.fullName}`,
    `${t('reservation.phone')}: ${booking.phone}`,
    `${t('reservation.date')}: ${booking.date}`,
    `${t('reservation.time')}: ${booking.time}`,
    `${t('reservation.guests')}: ${booking.guests}`,
  ];
  if (booking.specialRequests?.trim()) {
    lines.push(`${t('reservation.specialRequests')}: ${booking.specialRequests.trim()}`);
  }
  return lines.join('\n');
}

export default function ReservationConfirmationModal({ booking, onClose }) {
  const { t, language } = useLanguage();

  const handleSendWhatsapp = () => {
    const message = buildReservationMessage(booking, t, language);
    const url = `https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {booking && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 text-center sm:p-8"
            >
              <button
                onClick={onClose}
                aria-label={t('reservation.close')}
                className="absolute end-8 top-8 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-300 hover:text-gold"
              >
                <X size={16} />
              </button>

              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <CalendarCheck size={28} />
              </span>

              <p className="mt-5 font-display text-2xl text-zinc-50">{t('reservation.confirmedTitle')}</p>
              <p className="mt-2 text-sm text-zinc-400">{t('reservation.confirmedSubtitle')}</p>

              <div className="mt-6 rounded-2xl border border-gold/20 bg-gold/5 px-5 py-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">{t('reservation.bookingRef')}</p>
                <p className="mt-1 font-display text-2xl tracking-wider text-gold" dir="ltr">
                  {booking.bookingRef}
                </p>
              </div>

              <div className="mt-4 space-y-1 text-start text-sm text-zinc-400">
                <div className="flex justify-between">
                  <span>{t('reservation.date')}</span>
                  <span className="text-zinc-200">{booking.date}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('reservation.time')}</span>
                  <span className="text-zinc-200">{booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('reservation.guests')}</span>
                  <span className="text-zinc-200">{booking.guests}</span>
                </div>
              </div>

              <button
                onClick={handleSendWhatsapp}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
              >
                <Send size={15} />
                {t('reservation.sendWhatsapp')}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
