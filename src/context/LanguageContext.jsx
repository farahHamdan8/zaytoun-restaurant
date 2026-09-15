import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'zaytoun_language';

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'ar') return stored;
  // Fall back to the browser's language if nothing is stored yet.
  return navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Keep <html lang/dir> in sync so the whole document (not just React's
  // root node) reflows correctly for RTL, and persist the choice.
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language, dir]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  // t('nav.bookTable') -> resolves nested keys against the active
  // language's dictionary. Falls back to the key itself if missing,
  // so a typo shows up visibly instead of silently rendering blank.
  const t = useCallback(
    (path) => {
      const parts = path.split('.');
      let node = translations[language];
      for (const part of parts) {
        node = node?.[part];
      }
      return node ?? path;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, dir, isRTL: dir === 'rtl', setLanguage, toggleLanguage, t }),
    [language, dir, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
