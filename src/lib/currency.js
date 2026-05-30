/**
 * Currency helper — reads default_currency from settings.
 * '1' = PKR  |  '2' = SAR (default)
 */

const CURRENCIES = {
  '1': { code: 'PKR', symbol: 'Rs',  label: 'Pakistani Rupee' },
  '2': { code: 'SAR', symbol: 'SAR', label: 'Saudi Riyal'     },
};

/** Returns the currency object for the given setting value (or SAR fallback) */
export function getCurrency(settingValue) {
  return CURRENCIES[String(settingValue)] ?? CURRENCIES['2'];
}

/** Formats a number as currency string: "SAR 1,500" */
export function formatPrice(amount, settingValue = '2') {
  const { symbol } = getCurrency(settingValue);
  const num = Number(amount) || 0;
  return `${symbol} ${num.toLocaleString()}`;
}

/** Returns just the symbol prefix: "SAR" or "Rs" */
export function currencySymbol(settingValue = '2') {
  return getCurrency(settingValue).symbol;
}
