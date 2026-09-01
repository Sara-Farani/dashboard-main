export function formatToman(value: number): string {
  if (value >= 1_000_000_000) {
    const numberValue = value / 1_000_000_000

    return `${numberValue.toLocaleString('fa-IR', {
      maximumFractionDigits: numberValue >= 10 ? 1 : 2,
    })} میلیارد`
  }

  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000).toLocaleString('fa-IR')} میلیون`
  }

  return value.toLocaleString('fa-IR')
}

export function formatNumber(value: number | string): string {
  return Number(value).toLocaleString('fa-IR')
}

export function formatClock(date: Date | string | number): string {
  return new Date(date).toLocaleTimeString('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatDateFa(date: Date | string | number): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function requestCode(seq: number): string {
  return `VG-${String(seq).padStart(5, '0')}`
}