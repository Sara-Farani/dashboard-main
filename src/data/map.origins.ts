export const ORIGINS = [
  'بانک ملی ایران',
  'بانک ملت',
  'بانک صادرات',
  'بانک سپه',
  'بانک کشاورزی',
  'پست بانک',
  'بانک تجارت',
  'بانک رفاه کارگران',
  'خزانه استان',
  'سازمان هدفمندی یارانه‌ها',
  'صندوق بیمه اجتماعی',
  'اداره کل امور مالیاتی',
  'شرکت توزیع نیروی برق',
  'سازمان تأمین اجتماعی',
] as const

export const PURPOSES = [
  'واریز حقوق کارکنان',
  'پرداخت یارانه نقدی',
  'تسویه پیمانکاران',
  'کمک معیشتی خانوار',
  'پرداخت مستمری',
  'یارانه نان و کالا',
  'تسویه مطالبات فرهنگیان',
  'پرداخت حق بیمه گروهی',
] as const

export type Origin = (typeof ORIGINS)[number]
export type Purpose = (typeof PURPOSES)[number]

export function pick<T>(list: readonly T[]): T {
  if (list.length === 0) {
    throw new Error('Cannot pick an item from an empty list.')
  }

  return list[Math.floor(Math.random() * list.length)]!
}

interface AmountBand {
  min: number
  max: number
  p: number
}

const AMOUNT_BANDS: readonly AmountBand[] = [
  { min: 80_000_000, max: 450_000_000, p: 0.35 },
  { min: 450_000_000, max: 2_200_000_000, p: 0.4 },
  { min: 2_200_000_000, max: 8_500_000_000, p: 0.2 },
  { min: 8_500_000_000, max: 24_000_000_000, p: 0.05 },
]

export function randomAmount(): number {
  const roll = Math.random()
  let accumulatedProbability = 0

  const band =
    AMOUNT_BANDS.find((item) => {
      accumulatedProbability += item.p
      return roll <= accumulatedProbability
    }) ?? AMOUNT_BANDS[0]

  const rawAmount = band.min + Math.random() * (band.max - band.min)

  return Math.round(rawAmount / 1_000_000) * 1_000_000
}

export function randomRecipientCount(amount: number): number {
  const base = Math.round(amount / 18_000_000)

  const variation = Math.round((Math.random() - 0.5) * base * 0.3)

  return Math.max(40, Math.min(48_000, base + variation))
}