export type ProvinceLabelMode = 'single' | 'double' | 'rotate'

export interface ProvinceNameConfig {
  id: string
  nameFa: string
  nameEn?: string
  line1?: string
  line2?: string
  prefer: ProvinceLabelMode
  /** چرخش پیشنهادی (درجه) */
  rotate?: number
  /**
   * جابه‌جایی دستی نسبت به centroid
   * واحد: درجه جغرافیایی [lonDelta, latDelta]
   */
  offset?: [number, number]
  /**
   * اگر true باشد، offset روی centroid مارکر هم اعمال می‌شود
   * (مثلاً هرمزگان)
   */
  shiftCentroid?: boolean
}

export const PROVINCES: Record<string, ProvinceNameConfig> = {
  'IR-01': {
    id: 'IR-01',
    nameFa: 'آذربایجان شرقی',
    line1: 'آذربایجان',
    line2: 'شرقی',
    prefer: 'double',
    rotate: -12,
    offset: [0.05, -0.05],
  },
  'IR-02': {
    id: 'IR-02',
    nameFa: 'آذربایجان غربی',
    line1: 'آذربایجان',
    line2: 'غربی',
    prefer: 'double',
    rotate: -22,
    offset: [0.1, -0.15],
  },
  'IR-03': {
    id: 'IR-03',
    nameFa: 'اردبیل',
    prefer: 'single',
    offset: [0.05, 0],
  },
  'IR-04': {
    id: 'IR-04',
    nameFa: 'اصفهان',
    prefer: 'single',
    offset: [0.15, -0.2],
  },
  'IR-05': {
    id: 'IR-05',
    nameFa: 'ایلام',
    prefer: 'rotate',
    rotate: -58,
    offset: [0.05, 0.05],
  },
  'IR-06': {
    id: 'IR-06',
    nameFa: 'بوشهر',
    prefer: 'rotate',
    rotate: -72,
    offset: [-0.05, 0.05],
  },
  'IR-07': {
    id: 'IR-07',
    nameFa: 'تهران',
    prefer: 'single',
    offset: [0.05, -0.05],
  },
  'IR-08': {
    id: 'IR-08',
    nameFa: 'چهارمحال و بختیاری',
    line1: 'چهارمحال و',
    line2: 'بختیاری',
    prefer: 'double',
    offset: [0, 0.05],
  },
  'IR-10': {
    id: 'IR-10',
    nameFa: 'خوزستان',
    prefer: 'single',
    offset: [0.1, 0.1],
  },
  'IR-11': {
    id: 'IR-11',
    nameFa: 'زنجان',
    prefer: 'single',
  },
  'IR-12': {
    id: 'IR-12',
    nameFa: 'سمنان',
    prefer: 'single',
    offset: [0.35, -0.15],
  },
  'IR-13': {
    id: 'IR-13',
    nameFa: 'سیستان و بلوچستان',
    line1: 'سیستان و',
    line2: 'بلوچستان',
    prefer: 'double',
    offset: [0.2, -0.35],
  },
  'IR-14': {
    id: 'IR-14',
    nameFa: 'فارس',
    prefer: 'single',
    offset: [0.05, 0.1],
  },
  'IR-15': {
    id: 'IR-15',
    nameFa: 'کرمان',
    prefer: 'single',
    offset: [0.15, -0.2],
  },
  'IR-16': {
    id: 'IR-16',
    nameFa: 'کردستان',
    prefer: 'single',
  },
  'IR-17': {
    id: 'IR-17',
    nameFa: 'کرمانشاه',
    prefer: 'single',
  },
  'IR-18': {
    id: 'IR-18',
    nameFa: 'کهگیلویه و بویراحمد',
    line1: 'کهگیلویه و',
    line2: 'بویراحمد',
    prefer: 'double',
    offset: [0, 0.05],
  },
  'IR-19': {
    id: 'IR-19',
    nameFa: 'گیلان',
    prefer: 'rotate',
    rotate: -18,
    offset: [0.05, -0.05],
  },
  'IR-20': {
    id: 'IR-20',
    nameFa: 'لرستان',
    prefer: 'single',
  },
  'IR-21': {
    id: 'IR-21',
    nameFa: 'مازندران',
    prefer: 'rotate',
    rotate: -8,
    offset: [0.2, -0.05],
  },
  'IR-22': {
    id: 'IR-22',
    nameFa: 'مرکزی',
    prefer: 'single',
  },
  'IR-23': {
    id: 'IR-23',
    nameFa: 'هرمزگان',
    prefer: 'single',
    offset: [0.35, 0.05],
    shiftCentroid: true,
  },
  'IR-24': {
    id: 'IR-24',
    nameFa: 'همدان',
    prefer: 'single',
  },
  'IR-25': {
    id: 'IR-25',
    nameFa: 'یزد',
    prefer: 'single',
    offset: [0.1, 0],
  },
  'IR-26': {
    id: 'IR-26',
    nameFa: 'قم',
    prefer: 'single',
  },
  'IR-27': {
    id: 'IR-27',
    nameFa: 'گلستان',
    prefer: 'single',
    offset: [0.1, 0],
  },
  'IR-28': {
    id: 'IR-28',
    nameFa: 'قزوین',
    prefer: 'single',
  },
  'IR-29': {
    id: 'IR-29',
    nameFa: 'خراسان جنوبی',
    line1: 'خراسان',
    line2: 'جنوبی',
    prefer: 'double',
    offset: [0.15, -0.1],
  },
  'IR-30': {
    id: 'IR-30',
    nameFa: 'خراسان رضوی',
    line1: 'خراسان',
    line2: 'رضوی',
    prefer: 'double',
    offset: [0.2, -0.15],
  },
  'IR-31': {
    id: 'IR-31',
    nameFa: 'خراسان شمالی',
    line1: 'خراسان',
    line2: 'شمالی',
    prefer: 'double',
  },
  'IR-32': {
    id: 'IR-32',
    nameFa: 'البرز',
    prefer: 'single',
    offset: [0.02, 0],
  },
}

export function getProvinceNameFa(
  id?: string,
  fallbackEnglish?: string,
): ProvinceNameConfig {
  if (id && PROVINCES[id]) {
    return PROVINCES[id]
  }

  return {
    id: id ?? 'unknown',
    nameFa: fallbackEnglish ?? id ?? '',
    prefer: 'single',
  }
}