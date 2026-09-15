import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';

const EMPTY_FORM = { name: '', email: '', message: '' };

export default function ContactSection() {
  const { t, language } = useLanguage();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    ['name', 'email', 'message'].forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = t('contact.requiredField');
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const subject = encodeURIComponent(`Website inquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${restaurantInfo.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const handleWhatsappClick = () => {
    const message = language === 'ar' ? 'مرحبًا، لدي استفسار عن مطعم زيتون.' : "Hi, I have a question about Zaytoun.";
    const url = `https://wa.me/${restaurantInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="border-t border-white/5 px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-xs tracking-wide text-gold">{t('contact.eyebrow')}</span>
          <h2 className="mt-3 font-display text-4xl text-zinc-50 sm:text-5xl">{t('contact.title')}</h2>
          <p className="mt-3 text-zinc-400">{t('contact.subtitle')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-5">
          {/* Email form */}
          <div className="sm:col-span-3">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-8 text-center"
              >
                <CheckCircle2 size={30} className="text-emerald-400" />
                <p className="font-display text-xl text-zinc-50">{t('contact.sentTitle')}</p>
                <p className="text-sm text-zinc-400">{t('contact.sentSubtitle')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-zinc-900/50 p-6">
                <div className="grid gap-3">
                  <div>
                    <input
                      value={form.name}
                      onChange={updateField('name')}
                      placeholder={t('contact.name')}
                      className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                        errors.name ? 'border-red-500/60' : 'border-white/10'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                  </div>
                  <div>
                    <input
                      value={form.email}
                      onChange={updateField('email')}
                      type="email"
                      dir="ltr"
                      placeholder={t('contact.email')}
                      className={`w-full rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                        errors.email ? 'border-red-500/60' : 'border-white/10'
                      }`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                  </div>
                  <div>
                    <textarea
                      value={form.message}
                      onChange={updateField('message')}
                      placeholder={t('contact.messagePlaceholder')}
                      rows={4}
                      className={`w-full resize-none rounded-xl border bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-gold/50 ${
                        errors.message ? 'border-red-500/60' : 'border-white/10'
                      }`}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold text-zinc-950 shadow-gold transition-transform hover:scale-[1.02]"
                >
                  <Mail size={15} />
                  {t('contact.send')}
                </button>
              </form>
            )}
          </div>

          {/* WhatsApp direct chat */}
          <div className="flex flex-col justify-center gap-4 rounded-3xl border border-white/10 bg-zinc-900/50 p-6 text-center sm:col-span-2">
            <p className="text-sm text-zinc-400">{t('contact.orChatWhatsapp')}</p>
            <button
              onClick={handleWhatsappClick}
              className="flex h-12 items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
            >
              <MessageCircle size={16} />
              {t('contact.chatWhatsapp')}
            </button>
            <p className="text-xs text-zinc-600" dir="ltr">{restaurantInfo.phoneDisplay}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
