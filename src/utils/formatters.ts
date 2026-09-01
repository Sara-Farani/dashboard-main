// ------------------------------------------------------------------
// Persian (Jalali-era) numeral helpers
// ------------------------------------------------------------------

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert a number/string containing Latin digits to Persian digits */
export function toFaDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}

/** Thousands separator with Persian digits: 1234567 -> ۱٬۲۳۴٬۵۶۷ */
export function formatFaNumber(num: number): string {
  return toFaDigits(Number(num).toLocaleString('en-US'))
}

/** Format a JS Date as HH:mm with Persian digits */
export function formatTimeFa(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return toFaDigits(`${h}:${m}`)
}