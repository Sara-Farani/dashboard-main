export interface Province {
  id: string
  nameFa: string
  nameEn: string
  weight: number
}

export const PROVINCES = {
  'IR-01': { id: 'IR-01', nameFa: 'آذربایجان شرقی', nameEn: 'East Azerbaijan', weight: 5 },
  'IR-02': { id: 'IR-02', nameFa: 'آذربایجان غربی', nameEn: 'West Azerbaijan', weight: 4 },
  'IR-03': { id: 'IR-03', nameFa: 'اردبیل', nameEn: 'Ardabil', weight: 2 },
  'IR-04': { id: 'IR-04', nameFa: 'اصفهان', nameEn: 'Isfahan', weight: 8 },
  'IR-05': { id: 'IR-05', nameFa: 'ایلام', nameEn: 'Ilam', weight: 2 },
  'IR-06': { id: 'IR-06', nameFa: 'بوشهر', nameEn: 'Bushehr', weight: 3 },
  'IR-07': { id: 'IR-07', nameFa: 'تهران', nameEn: 'Tehran', weight: 18 },
  'IR-08': { id: 'IR-08', nameFa: 'چهارمحال و بختیاری', nameEn: 'Chaharmahal and Bakhtiari', weight: 2 },
  'IR-10': { id: 'IR-10', nameFa: 'خوزستان', nameEn: 'Khuzestan', weight: 6 },
  'IR-11': { id: 'IR-11', nameFa: 'زنجان', nameEn: 'Zanjan', weight: 2 },
  'IR-12': { id: 'IR-12', nameFa: 'سمنان', nameEn: 'Semnan', weight: 2 },
  'IR-13': { id: 'IR-13', nameFa: 'سیستان و بلوچستان', nameEn: 'Sistan and Baluchestan', weight: 3 },
  'IR-14': { id: 'IR-14', nameFa: 'فارس', nameEn: 'Fars', weight: 7 },
  'IR-15': { id: 'IR-15', nameFa: 'کرمان', nameEn: 'Kerman', weight: 4 },
  'IR-16': { id: 'IR-16', nameFa: 'کردستان', nameEn: 'Kurdistan', weight: 3 },
  'IR-17': { id: 'IR-17', nameFa: 'کرمانشاه', nameEn: 'Kermanshah', weight: 3 },
  'IR-18': { id: 'IR-18', nameFa: 'کهگیلویه و بویراحمد', nameEn: 'Kohgiluyeh and Boyer-Ahmad', weight: 2 },
  'IR-19': { id: 'IR-19', nameFa: 'گیلان', nameEn: 'Gilan', weight: 4 },
  'IR-20': { id: 'IR-20', nameFa: 'لرستان', nameEn: 'Lorestan', weight: 3 },
  'IR-21': { id: 'IR-21', nameFa: 'مازندران', nameEn: 'Mazandaran', weight: 5 },
  'IR-22': { id: 'IR-22', nameFa: 'مرکزی', nameEn: 'Markazi', weight: 3 },
  'IR-23': { id: 'IR-23', nameFa: 'هرمزگان', nameEn: 'Hormozgan', weight: 3 },
  'IR-24': { id: 'IR-24', nameFa: 'همدان', nameEn: 'Hamadan', weight: 3 },
  'IR-25': { id: 'IR-25', nameFa: 'یزد', nameEn: 'Yazd', weight: 3 },
  'IR-26': { id: 'IR-26', nameFa: 'قم', nameEn: 'Qom', weight: 3 },
  'IR-27': { id: 'IR-27', nameFa: 'گلستان', nameEn: 'Golestan', weight: 3 },
  'IR-28': { id: 'IR-28', nameFa: 'قزوین', nameEn: 'Qazvin', weight: 3 },
  'IR-29': { id: 'IR-29', nameFa: 'خراسان جنوبی', nameEn: 'South Khorasan', weight: 2 },
  'IR-30': { id: 'IR-30', nameFa: 'خراسان رضوی', nameEn: 'Razavi Khorasan', weight: 8 },
  'IR-31': { id: 'IR-31', nameFa: 'خراسان شمالی', nameEn: 'North Khorasan', weight: 2 },
  'IR-32': { id: 'IR-32', nameFa: 'البرز', nameEn: 'Alborz', weight: 6 },
} as const satisfies Record<string, Province>

export type ProvinceId = keyof typeof PROVINCES

export const PROVINCE_LIST = Object.values(PROVINCES) as Province[]

const weightTotal = PROVINCE_LIST.reduce(
  (sum, province) => sum + province.weight,
  0,
)

export function pickWeightedProvince(): Province {
  let roll = Math.random() * weightTotal

  for (const province of PROVINCE_LIST) {
    roll -= province.weight

    if (roll <= 0) {
      return province
    }
  }

  return PROVINCES['IR-07']
}

export function getProvince(id: string): Province | undefined {
  return PROVINCES[id as ProvinceId]
}