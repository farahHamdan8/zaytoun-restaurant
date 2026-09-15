import { useState } from 'react';
import { Users, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';
import ReservationConfirmationModal from './ReservationConfirmationModal';

const EMPTY_FORM = { fullName: '', phone: '', date: '', time: '', guests: 2, specialRequests: '' };

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function generateBookingRef() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-4);
  const random = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `ZYT-${stamp}${random}`;
}

export default function ReservationSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const updateField = (field) => (e) => {
    const value = field === 'guests' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = t('reservation.requiredField');
    if (!form.phone.trim()) nextErrors.phone = t('reservation.requiredField');
    if (!form.date) nextErrors.date = t('reservation.requiredField');
    else if (form.date < todayISO()) nextErrors.date = t('reservation.futureDateError');
    if (!form.time) nextErrors.time = t('reservation.requiredField');
    return nextErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setConfirmedBooking({ ...form, bookingRef: generateBookingRef() });
  };

  const handleCloseConfirmation = () => {
    setConfirmedBooking(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  return (
    <section id="reservations" className="border-t border-white/5 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="text-xs tracking-wide text-gold">{t('reservation.eyebrow')}</span>
          <h2 className="mt-3 font-display text-4xl text-zinc-50 sm:text-5xl">{t('reservation.title')}</h2>
          <p className="mt-3 text-zinc-400">{t('reservation.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <input
                value={form.fullName}
                onChange={updateField('fullName')}
                placeholder={t('reservation.fullName')}
                className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                  errors.fullName ? 'border-red-500/60' : 'border-white/10'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>}
            </div>
            <div>
              <input
                value={form.phone}
                onChange={updateField('phone')}
                type="tel"
                dir="ltr"
                placeholder={t('reservation.phone')}
                className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                  errors.phone ? 'border-red-500/60' : 'border-white/10'
                }`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <Calendar size={13} /> {t('reservation.date')}
              </label>
              <input
                type="date"
                value={form.date}
                min={todayISO()}
                onChange={updateField('date')}
                className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 focus:border-gold/50 ${
                  errors.date ? 'border-red-500/60' : 'border-white/10'
                }`}
              />
              {errors.date && <p className="mt-1 text-xs text-red-400">{errors.date}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <Clock size={13} /> {t('reservation.time')}
              </label>
              <input
                type="time"
                value={form.time}
                onChange={updateField('time')}
                className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 focus:border-gold/50 ${
                  errors.time ? 'border-red-500/60' : 'border-white/10'
                }`}
              />
              {errors.time && <p className="mt-1 text-xs text-red-400">{errors.time}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-zinc-500">
                <Users size={13} /> {t('reservation.guests')}
              </label>
              <input
                type="range"
                min={1}
                max={restaurantInfo.maxGuestsPerBooking}
                value={form.guests}
                onChange={updateField('guests')}
                className="w-full accent-gold"
              />
              <p className="mt-1 text-sm text-zinc-300">
                {form.guests} {t('reservation.guestsUnit')}
              </p>
            </div>

            <div className="sm:col-span-2">
              <textarea
                value={form.specialRequests}
                onChange={updateField('specialRequests')}
                placeholder={t('reservation.specialRequestsPlaceholder')}
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
          >
            {t('reservation.submit')}
          </button>
        </form>
      </div>

      <ReservationConfirmationModal booking={confirmedBooking} onClose={handleCloseConfirmation} />
    </section>
  );
}
