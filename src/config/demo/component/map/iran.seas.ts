export type GeoPoint = [longitude: number, latitude: number]

export type SeaId = 'caspian' | 'persian-gulf' | 'oman-sea'

export type ForeignCountryCode =
  | 'AZ'
  | 'TM'
  | 'IQ'
  | 'KW'
  | 'SA'
  | 'BH'
  | 'QA'
  | 'AE'
  | 'OM'
  | 'PK'

export interface SeaCoastline {
  id: string
  countryCode: ForeignCountryCode
  countryNameFa: string

  /**
   * مسیر خط ساحلی کشور.
   * این مسیر فقط خط واقعی ساحل است و نباید شامل ضلع‌های
   * مصنوعی بسته‌شدن Polygon آب باشد.
   */
  coordinates: GeoPoint[]

  /**
   * برای جزایر بسته، مانند بحرین.
   */
  closed?: boolean
}

export interface SeaLandPatch {
  id: string
  countryCode: ForeignCountryCode
  countryNameFa: string

  /**
   * محدوده خشکی جزایر یا قسمت‌هایی که داخل Polygon آب قرار دارند.
   */
  coordinates: GeoPoint[]
}

export interface SeaFeature {
  id: SeaId
  nameFa: string
  className: string
  labelClassName: string
  label: GeoPoint

  /**
   * Polygon کامل آب.
   *
   * این مسیر از ساحل ایران شروع شده، ساحل کشورهای روبه‌رو را
   * دنبال می‌کند و در نهایت بسته می‌شود. بنابراین تمام فضای
   * میان ساحل ایران و کشورهای دیگر با آب پر خواهد شد.
   */
  waterBoundary: GeoPoint[]

  /**
   * خط ساحلی ایران.
   *
   * این خط با ضخامت کم زیر استان‌های ایران رسم می‌شود و معمولاً
   * توسط مرز استان‌های ساحلی پوشانده خواهد شد.
   */
  iranCoastline: GeoPoint[]

  /**
   * خطوط ساحلی کشورهای خارجی.
   */
  foreignCoastlines: SeaCoastline[]

  /**
   * جزایر یا خشکی‌های واقع‌شده داخل Polygon آب.
   */
  landPatches?: SeaLandPatch[]

  /**
   * خطوط موج تزئینی.
   */
  waves?: GeoPoint[][]
}

const CASPIAN_IRAN_COAST: GeoPoint[] = [
  [48.87, 38.44],
  [48.98, 38.22],
  [49.18, 37.94],
  [49.45, 37.63],
  [49.78, 37.34],
  [50.15, 37.08],
  [50.55, 36.9],
  [50.98, 36.78],
  [51.42, 36.72],
  [51.88, 36.7],
  [52.34, 36.74],
  [52.77, 36.8],
  [53.14, 36.88],
  [53.46, 36.98],
  [53.72, 37.12],
  [53.9, 37.3],
  [54.02, 37.48],
]

const CASPIAN_AZERBAIJAN_COAST: GeoPoint[] = [
  [48.87, 38.44],
  [48.8, 38.62],
  [48.75, 38.82],
  [48.72, 39.02],
  [48.74, 39.2],
  [48.78, 39.38],
  [48.84, 39.56],
]

const CASPIAN_TURKMENISTAN_COAST: GeoPoint[] = [
  [54.72, 39.56],
  [54.68, 39.34],
  [54.62, 39.12],
  [54.53, 38.9],
  [54.43, 38.68],
  [54.31, 38.45],
  [54.2, 38.22],
  [54.1, 37.98],
  [54.04, 37.72],
  [54.02, 37.48],
]

const PERSIAN_GULF_IRAN_COAST: GeoPoint[] = [
  [47.95, 30.0],
  [48.18, 29.94],
  [48.45, 29.78],
  [48.74, 29.58],
  [49.05, 29.36],
  [49.38, 29.13],
  [49.72, 28.9],
  [50.07, 28.65],
  [50.42, 28.42],
  [50.79, 28.18],
  [51.17, 27.95],
  [51.56, 27.72],
  [51.96, 27.5],
  [52.37, 27.29],
  [52.79, 27.1],
  [53.22, 26.91],
  [53.65, 26.74],
  [54.08, 26.61],
  [54.49, 26.51],
  [54.88, 26.46],
  [55.22, 26.47],
  [55.52, 26.52],
  [55.77, 26.6],
  [55.98, 26.72],
  [56.17, 26.82],
  [56.36, 26.69],
  [56.49, 26.48],
  [56.5, 26.28],
]

const PERSIAN_GULF_OMAN_COAST: GeoPoint[] = [
  [56.5, 26.28],
  [56.47, 26.15],
  [56.4, 26.03],
  [56.31, 25.92],
  [56.21, 25.82],
]

const PERSIAN_GULF_UAE_COAST: GeoPoint[] = [
  [56.21, 25.82],
  [56.03, 25.69],
  [55.81, 25.56],
  [55.56, 25.42],
  [55.28, 25.27],
  [54.98, 25.11],
  [54.65, 24.97],
  [54.3, 24.84],
  [53.93, 24.73],
  [53.54, 24.64],
  [53.15, 24.58],
  [52.76, 24.55],
  [52.38, 24.56],
  [52.05, 24.61],
  [51.79, 24.68],
  [51.58, 24.78],
]

/**
 * ساحل قطر از مرز جنوبی، دور شبه‌جزیره و سپس تا مرز غربی.
 */
const PERSIAN_GULF_QATAR_COAST: GeoPoint[] = [
  [51.58, 24.78],
  [51.48, 24.9],
  [51.42, 25.08],
  [51.41, 25.3],
  [51.43, 25.54],
  [51.47, 25.78],
  [51.52, 26.0],
  [51.47, 26.16],
  [51.35, 26.2],
  [51.23, 26.1],
  [51.17, 25.92],
  [51.14, 25.68],
  [51.12, 25.43],
  [51.13, 25.2],
  [51.17, 25.0],
  [51.23, 24.86],
]

const PERSIAN_GULF_SAUDI_COAST: GeoPoint[] = [
  [51.23, 24.86],
  [51.05, 25.0],
  [50.89, 25.2],
  [50.73, 25.43],
  [50.56, 25.68],
  [50.37, 25.93],
  [50.17, 26.18],
  [49.96, 26.43],
  [49.73, 26.68],
  [49.5, 26.93],
  [49.28, 27.2],
  [49.07, 27.47],
  [48.88, 27.76],
  [48.7, 28.06],
  [48.55, 28.36],
  [48.43, 28.65],
  [48.34, 28.88],
]

const PERSIAN_GULF_KUWAIT_COAST: GeoPoint[] = [
  [48.34, 28.88],
  [48.25, 29.03],
  [48.18, 29.2],
  [48.16, 29.39],
  [48.17, 29.58],
  [48.13, 29.74],
  [48.05, 29.86],
]

const PERSIAN_GULF_IRAQ_COAST: GeoPoint[] = [
  [48.05, 29.86],
  [47.98, 29.91],
  [47.92, 29.95],
  [47.88, 29.98],
  [47.95, 30.0],
]

const OMAN_SEA_IRAN_COAST: GeoPoint[] = [
  [56.45, 26.42],
  [56.68, 26.47],
  [56.94, 26.39],
  [57.22, 26.25],
  [57.51, 26.1],
  [57.82, 25.94],
  [58.15, 25.78],
  [58.49, 25.63],
  [58.84, 25.49],
  [59.2, 25.38],
  [59.57, 25.29],
  [59.94, 25.23],
  [60.31, 25.2],
  [60.67, 25.19],
  [61.02, 25.2],
  [61.34, 25.21],
  [61.55, 25.2],
]

const OMAN_SEA_PAKISTAN_COAST: GeoPoint[] = [
  [61.55, 25.2],
  [61.72, 25.13],
  [61.89, 25.03],
  [62.05, 24.92],
  [62.18, 24.8],
]

const OMAN_SEA_OMAN_COAST: GeoPoint[] = [
  [60.05, 23.48],
  [59.76, 23.41],
  [59.46, 23.36],
  [59.15, 23.34],
  [58.84, 23.36],
  [58.54, 23.43],
  [58.24, 23.54],
  [57.95, 23.69],
  [57.67, 23.86],
  [57.41, 24.05],
  [57.17, 24.25],
  [56.95, 24.46],
  [56.76, 24.67],
  [56.6, 24.89],
  [56.47, 25.1],
  [56.37, 25.3],
]

const OMAN_SEA_UAE_COAST: GeoPoint[] = [
  [56.37, 25.3],
  [56.31, 25.48],
  [56.29, 25.65],
  [56.31, 25.82],
  [56.36, 25.99],
  [56.42, 26.15],
  [56.45, 26.42],
]

export const IRAN_SEAS: SeaFeature[] = [
  {
    id: 'caspian',
    nameFa: 'دریای خزر',
    className: 'sea-water sea-caspian-water',
    labelClassName: 'sea-label sea-caspian-label',
    label: [51.55, 38.15],

    iranCoastline: CASPIAN_IRAN_COAST,

    /*
     * ترتیب Polygon:
     * ساحل ایران از غرب به شرق
     * ساحل ترکمنستان از جنوب به شمال
     * ضلع بالایی نامرئی
     * ساحل جمهوری آذربایجان از شمال به جنوب
     */
    waterBoundary: [
      ...CASPIAN_IRAN_COAST,
      ...[...CASPIAN_TURKMENISTAN_COAST].reverse(),
      [53.7, 39.64],
      [52.5, 39.68],
      [51.2, 39.68],
      [49.9, 39.65],
      [48.84, 39.56],
      ...[...CASPIAN_AZERBAIJAN_COAST].reverse(),
    ],

    foreignCoastlines: [
      {
        id: 'caspian-azerbaijan',
        countryCode: 'AZ',
        countryNameFa: 'جمهوری آذربایجان',
        coordinates: CASPIAN_AZERBAIJAN_COAST,
      },
      {
        id: 'caspian-turkmenistan',
        countryCode: 'TM',
        countryNameFa: 'ترکمنستان',
        coordinates: CASPIAN_TURKMENISTAN_COAST,
      },
    ],

    waves: [
      [
        [49.35, 38.1],
        [50.15, 38.32],
        [51.05, 38.45],
        [51.95, 38.48],
        [52.85, 38.42],
        [53.55, 38.27],
      ],
      [
        [49.45, 37.72],
        [50.3, 37.94],
        [51.2, 38.08],
        [52.1, 38.12],
        [53.0, 38.03],
      ],
    ],
  },

  {
    id: 'persian-gulf',
    nameFa: 'خلیج فارس',
    className: 'sea-water sea-persian-gulf-water',
    labelClassName: 'sea-label sea-persian-gulf-label',
    label: [52.7, 26.55],

    iranCoastline: PERSIAN_GULF_IRAN_COAST,

    /*
     * این Polygon مستقیماً ساحل ایران را به ساحل عمان، امارات،
     * قطر، عربستان، کویت و عراق متصل می‌کند.
     * در نتیجه هیچ فضای شفافی بین دو ساحل باقی نمی‌ماند.
     */
    waterBoundary: [
      ...PERSIAN_GULF_IRAN_COAST,
      ...PERSIAN_GULF_OMAN_COAST,
      ...PERSIAN_GULF_UAE_COAST.slice(1),
      ...PERSIAN_GULF_QATAR_COAST.slice(1),
      ...PERSIAN_GULF_SAUDI_COAST.slice(1),
      ...PERSIAN_GULF_KUWAIT_COAST.slice(1),
      ...PERSIAN_GULF_IRAQ_COAST.slice(1),
    ],

    foreignCoastlines: [
      {
        id: 'persian-gulf-iraq',
        countryCode: 'IQ',
        countryNameFa: 'عراق',
        coordinates: PERSIAN_GULF_IRAQ_COAST,
      },
      {
        id: 'persian-gulf-kuwait',
        countryCode: 'KW',
        countryNameFa: 'کویت',
        coordinates: PERSIAN_GULF_KUWAIT_COAST,
      },
      {
        id: 'persian-gulf-saudi-arabia',
        countryCode: 'SA',
        countryNameFa: 'عربستان سعودی',
        coordinates: PERSIAN_GULF_SAUDI_COAST,
      },
      {
        id: 'persian-gulf-qatar',
        countryCode: 'QA',
        countryNameFa: 'قطر',
        coordinates: PERSIAN_GULF_QATAR_COAST,
      },
      {
        id: 'persian-gulf-uae',
        countryCode: 'AE',
        countryNameFa: 'امارات متحده عربی',
        coordinates: PERSIAN_GULF_UAE_COAST,
      },
      {
        id: 'persian-gulf-oman',
        countryCode: 'OM',
        countryNameFa: 'عمان',
        coordinates: PERSIAN_GULF_OMAN_COAST,
      },
    ],

    landPatches: [
      {
        id: 'bahrain-island',
        countryCode: 'BH',
        countryNameFa: 'بحرین',
        coordinates: [
          [50.46, 26.31],
          [50.57, 26.34],
          [50.66, 26.28],
          [50.7, 26.17],
          [50.67, 26.06],
          [50.59, 25.98],
          [50.5, 26.0],
          [50.45, 26.1],
          [50.43, 26.21],
          [50.46, 26.31],
        ],
      },
    ],

    waves: [
      [
        [48.8, 29.35],
        [49.7, 28.85],
        [50.7, 28.32],
        [51.75, 27.82],
        [52.85, 27.4],
        [53.95, 27.05],
        [54.9, 26.86],
      ],
      [
        [49.15, 28.78],
        [50.15, 28.26],
        [51.2, 27.77],
        [52.3, 27.35],
        [53.4, 27.0],
        [54.42, 26.8],
      ],
    ],
  },

  {
    id: 'oman-sea',
    nameFa: 'دریای عمان',
    className: 'sea-water sea-oman-water',
    labelClassName: 'sea-label sea-oman-label',
    label: [59.15, 24.45],

    iranCoastline: OMAN_SEA_IRAN_COAST,

    /*
     * اضلاع شرقی و جنوبی صرفاً برای بسته‌شدن سطح آب هستند.
     * چون فقط coastlineها stroke می‌شوند، این اضلاع روی نقشه
     * به‌عنوان مرز نمایش داده نخواهند شد.
     */
    waterBoundary: [
      ...OMAN_SEA_IRAN_COAST,
      ...OMAN_SEA_PAKISTAN_COAST.slice(1),
      [62.2, 23.45],
      [61.1, 23.42],
      ...OMAN_SEA_OMAN_COAST,
      ...OMAN_SEA_UAE_COAST,
    ],

    foreignCoastlines: [
      {
        id: 'oman-sea-pakistan',
        countryCode: 'PK',
        countryNameFa: 'پاکستان',
        coordinates: OMAN_SEA_PAKISTAN_COAST,
      },
      {
        id: 'oman-sea-oman',
        countryCode: 'OM',
        countryNameFa: 'عمان',
        coordinates: OMAN_SEA_OMAN_COAST,
      },
      {
        id: 'oman-sea-uae',
        countryCode: 'AE',
        countryNameFa: 'امارات متحده عربی',
        coordinates: OMAN_SEA_UAE_COAST,
      },
    ],

    waves: [
      [
        [56.9, 25.88],
        [57.75, 25.47],
        [58.65, 25.12],
        [59.6, 24.9],
        [60.55, 24.78],
        [61.35, 24.77],
      ],
      [
        [57.15, 25.4],
        [58.05, 25.02],
        [59.0, 24.75],
        [59.95, 24.58],
        [60.85, 24.52],
      ],
    ],
  },
]

/**
 * تمام نقاط جغرافیایی مربوط به دریاها.
 * این خروجی برای محاسبه محدوده نقشه استفاده می‌شود.
 */
export function getAllSeaPoints(): GeoPoint[] {
  const points: GeoPoint[] = []

  for (const sea of IRAN_SEAS) {
    points.push(sea.label)
    points.push(...sea.waterBoundary)
    points.push(...sea.iranCoastline)

    for (const coastline of sea.foreignCoastlines) {
      points.push(...coastline.coordinates)
    }

    for (const patch of sea.landPatches ?? []) {
      points.push(...patch.coordinates)
    }

    for (const wave of sea.waves ?? []) {
      points.push(...wave)
    }
  }

  return points
}