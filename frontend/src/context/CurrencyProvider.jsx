import { useState, useEffect } from 'react';
import { CurrencyContext } from './CurrencyContextObject';
import { CURRENCY_RATES } from './currencyConstants';

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('visit_siliana_currency') || 'TND';
  });

  useEffect(() => {
    localStorage.setItem('visit_siliana_currency', currency);
  }, [currency]);

  const activeCurrency = CURRENCY_RATES[currency] || CURRENCY_RATES.TND;

  const formatPrice = (amountInTND) => {
    if (amountInTND === null || amountInTND === undefined || isNaN(amountInTND)) return '—';
    const num = Number(amountInTND);
    const converted = num * activeCurrency.rate;
    
    if (currency === 'TND') {
      return `${Math.round(converted)} DT`;
    } else if (currency === 'EUR') {
      return `${converted.toFixed(1)} €`;
    } else {
      return `$${converted.toFixed(1)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, activeCurrency, formatPrice, CURRENCY_RATES }}>
      {children}
    </CurrencyContext.Provider>
  );
}
