import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ShoppingBag, Languages, UtensilsCrossed } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { restaurantInfo } from '../data/restaurantInfo';

const NAV_LINKS = [
  { key: 'nav.home', href: '#home' },
  { key: 'nav.menu', href: '#menu' },
  { key: 'nav.reservations', href: '#reservations' },
  { key: 'nav.story', href: '#story' },
  { key: 'nav.contact', href: '#contact' },
];

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { itemCount, toggleCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setIsMobileOpen(false);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNavClick = (href) => {
    setIsMobileOpen(false);
    
    // تأخير بسيط للسماح بانغلاق القائمة قبل البدء بالتمرير
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          className="flex items-center gap-2.5 shrink-0"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
            <UtensilsCrossed size={18} strokeWidth={1.75} />
          </span>
          <span className="font-display text-2xl tracking-wide text-zinc-50">
            {restaurantInfo.name[language]}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm text-zinc-300 transition-colors hover:text-gold"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right-side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            aria-label="Toggle language"
            className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 px-3 text-xs font-medium text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Languages size={15} strokeWidth={1.75} />
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          <button
            onClick={toggleCart}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-200 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <ShoppingBag size={18} strokeWidth={1.75} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-bold text-zinc-950"
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <a
            href="#reservations"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#reservations');
            }}
            className="hidden h-10 items-center rounded-full bg-gold px-5 text-sm text-zinc-950 shadow-gold transition-transform hover:scale-[1.03] sm:flex"
          >
            {t('nav.bookTable')}
          </a>

          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-200 lg:hidden"
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="block rounded-lg px-3 py-3 text-zinc-200 transition-colors hover:bg-white/5 hover:text-gold"
                  >
                    {t(link.key)}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href="#reservations"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#reservations');
                  }}
                  className="flex h-11 items-center justify-center rounded-full bg-gold text-sm font-semibold text-zinc-950"
                >
                  {t('nav.bookTable')}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}