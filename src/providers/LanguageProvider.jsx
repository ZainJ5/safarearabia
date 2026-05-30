'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { t } from '@/lib/i18n';

const LanguageContext = createContext({ lang: 'en', setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('lang') || 'en';
    setLangState(saved);
    document.documentElement.lang = saved;
    document.documentElement.dir  = saved === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (key) => t(key, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
