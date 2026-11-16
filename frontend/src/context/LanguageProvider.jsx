import { useState, useEffect } from 'react';
import { LanguageContext } from './LanguageContextObject';
import { translations } from './translations';

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('visit_siliana_lang') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('visit_siliana_lang', lang);
    const htmlEl = document.documentElement;
    htmlEl.setAttribute('lang', lang);
    if (lang === 'ar') {
      htmlEl.setAttribute('dir', 'rtl');
    } else {
      htmlEl.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const t = translations[lang] || translations.fr;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
