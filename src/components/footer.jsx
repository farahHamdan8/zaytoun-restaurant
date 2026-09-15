import { Instagram, Facebook, Music2, MapPin, Phone, Mail, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { restaurantInfo } from '../data/restaurantInfo';

const NAV_LINKS = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.menu', href: '#menu' },
  { key: 'nav.reservations', href: '#reservations' },
  { key: 'nav.story', href: '#story' },
  { key: 'nav.contact', href: '#contact' },
];

const SOCIAL_LINKS = [
  { id: 'instagram', Icon: Instagram, href: restaurantInfo.social.instagram },
  { id: 'facebook', Icon: Facebook, href: restaurantInfo.social.facebook },
  { id: 'tiktok', Icon: Music2, href: restaurantInfo.social.tiktok },
];

export default function Footer() {
  const { t, language } = useLanguage();

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantInfo.mapsQuery)}`;

  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="border-t border-white/5 bg-zinc-950 px-5 pt-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                <UtensilsCrossed size={18} strokeWidth={1.75} />
              </span>
              <span className="font-display text-2xl text-zinc-50">{restaurantInfo.name[language]}</span>
            </div>
            <p className="mt-4 text-sm text-zinc-500">{restaurantInfo.tagline[language]}</p>
            <div className="mt-5 flex gap-2">
              {SOCIAL_LINKS.map(({ id, Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={id}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">{t('footer.quickLinks')}</h4>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(link.href);
                    }}
                    className="text-sm text-zinc-500 transition-colors hover:text-gold"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening hours */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">{t('footer.openingHours')}</h4>
            <ul className="mt-4 space-y-2.5">
              {restaurantInfo.openingHours.map((slot) => (
                <li key={slot.day.en} className="text-sm text-zinc-500">
                  <span className="block text-zinc-400">{slot.day[language]}</span>
                  <span dir="ltr" className="block">{slot.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact recap */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-200">{t('footer.contactUs')}</h4>
            <ul className="mt-4 space-y-3 text-sm text-zinc-500">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 shrink-0 text-gold" />
                <span>{restaurantInfo.address[language]}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-gold" />
                <span dir="ltr">{restaurantInfo.phoneDisplay}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-gold" />
                <span dir="ltr">{restaurantInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map placeholder */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-12 flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 px-6 py-5 transition-colors hover:border-gold/30"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold">
              <MapPin size={18} />
            </span>
            <span className="text-start">
              <span className="block text-sm font-medium text-zinc-100">{restaurantInfo.address[language]}</span>
              <span className="block text-xs text-zinc-500">{t('footer.getDirections')}</span>
            </span>
          </span>
          <ExternalLink size={16} className="shrink-0 text-zinc-500 transition-colors group-hover:text-gold" />
        </a>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 py-6 text-center sm:flex-row sm:text-start">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} {restaurantInfo.name[language]}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
