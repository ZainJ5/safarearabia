'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrency } from '@/lib/currency';

const SettingsContext = createContext({
  currency: { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal' },
  currencySymbol: 'SAR',
  settings: {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [currency, setCurrency] = useState({ code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal' });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) {
          setSettings(data.data);
          const cur = getCurrency(data.data.default_currency ?? '2');
          setCurrency(cur);
        }
      })
      .catch(() => {}); // silent — fallback to SAR default
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, currency, currencySymbol: currency.symbol }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
