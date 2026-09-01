import geojsonData from '../../../../data/iran.provinces.json'
import { PROVINCES } from '../../../../data/map.provinces'
import type {
  IranGeometry,
  IranProvinceFeature,
  IranProvinceFeatureCollection,
  LinearRing,
  Position,
} from '../../../../types/iran-provinces.types'

interface ProvinceMeta {
  nameFa?: string
  nameEn?: string
}

interface Bounds {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

export interface MapFeature {
  id: string
  nameFa: string
  nameEn: string
  d: string
  centroid: [x: number, y: number]
}

const geojson = geojsonData as unknown as IranProvinceFeatureCollection

const provinceMeta = PROVINCES as Record<string, ProvinceMeta>

/*
 * اندازه فضای داخلی SVG.
 * ارتفاع بیشتر در نظر گرفته شده تا جنوب کشور، خلیج فارس و دریای عمان
 * فضای کافی برای نمایش داشته باشند.
 */
const VIEW_W = 1000
const VIEW_H = 920
const PAD = 28

/*
 * برای نزدیک شدن نسبت طول و عرض جغرافیایی ایران به نمایش واقعی روی SVG.
 */
const LAT_MID = 32.4
const LON_SCALE = Math.cos((LAT_MID * Math.PI) / 180)

/**
 * تمام حلقه‌های geometry شامل Polygon و MultiPolygon.
 *
 * Polygon:
 * [
 *   [outerRing],
 *   [holeRing]
 * ]
 *
 * MultiPolygon:
 * [
 *   [[outerRing], [holeRing]],
 *   [[outerRing]]
 * ]
 */
function allRingsOf(geometry: IranGeometry): LinearRing[] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates
  }

  return geometry.coordinates.flat()
}

/**
 * فقط حلقه خارجی هر Polygon.
 * حفره‌های داخلی برای محاسبه مرکز استان کاربرد ندارند.
 */
function outerRingsOf(geometry: IranGeometry): LinearRing[] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.length > 0 ? [geometry.coordinates[0]] : []
  }

  return geometry.coordinates
    .map((polygon) => polygon[0])
    .filter((ring): ring is LinearRing => Boolean(ring?.length))
}

function boundsOf(features: IranProvinceFeature[]): Bounds {
  let minLon = Infinity
  let maxLon = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  for (const feature of features) {
    for (const ring of allRingsOf(feature.geometry)) {
      for (const [lon, lat] of ring) {
        minLon = Math.min(minLon, lon)
        maxLon = Math.max(maxLon, lon)
        minLat = Math.min(minLat, lat)
        maxLat = Math.max(maxLat, lat)
      }
    }
  }

  if (
    !Number.isFinite(minLon) ||
    !Number.isFinite(maxLon) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLat)
  ) {
    throw new Error('Iran provinces GeoJSON does not contain valid coordinates.')
  }

  return {
    minLon,
    maxLon,
    minLat,
    maxLat,
  }
}

const bounds = boundsOf(geojson.features)

const lonSpan = (bounds.maxLon - bounds.minLon) * LON_SCALE
const latSpan = bounds.maxLat - bounds.minLat

const usableW = VIEW_W - PAD * 2
const usableH = VIEW_H - PAD * 2

const scale = Math.min(
  usableW / Math.max(lonSpan, 1),
  usableH / Math.max(latSpan, 1),
)

const offsetX = PAD + (usableW - lonSpan * scale) / 2
const offsetY = PAD + (usableH - latSpan * scale) / 2

export const MAP_VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`

/**
 * تبدیل مختصات جغرافیایی GeoJSON به مختصات SVG.
 */
export function project([lon, lat]: Position): [number, number] {
  const x = offsetX + (lon - bounds.minLon) * LON_SCALE * scale
  const y = offsetY + (bounds.maxLat - lat) * scale

  return [x, y]
}

function ringToPath(ring: LinearRing): string {
  if (ring.length === 0) {
    return ''
  }

  const commands = ring.map((point, index) => {
    const [x, y] = project(point)

    return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  })

  return `${commands.join(' ')} Z`
}

/**
 * آخرین نقطه یک Ring در GeoJSON گاهی برابر نقطه اول است.
 * برای محاسبات هندسی، نقطه تکراری نهایی حذف می‌شود.
 */
function normalizeRing(ring: LinearRing): LinearRing {
  if (ring.length < 2) {
    return ring
  }

  const first = ring[0]
  const last = ring[ring.length - 1]

  const isClosed =
    first[0] === last[0] &&
    first[1] === last[1]

  return isClosed ? ring.slice(0, -1) : ring
}

interface PolygonCentroid {
  x: number
  y: number
  area: number
}

/**
 * محاسبه مرکز واقعی‌تر یک چندضلعی با فرمول Shoelace.
 *
 * این روش نسبت به میانگین ساده نقاط، محل مناسب‌تری برای برچسب استان
 * پیدا می‌کند؛ مخصوصاً در استان‌های نامنظم.
 */
function polygonCentroid(ring: LinearRing): PolygonCentroid | null {
  const points = normalizeRing(ring)

  if (points.length < 3) {
    return null
  }

  let twiceArea = 0
  let centroidX = 0
  let centroidY = 0

  for (let index = 0; index < points.length; index += 1) {
    const current = project(points[index])
    const next = project(points[(index + 1) % points.length])

    const cross = current[0] * next[1] - next[0] * current[1]

    twiceArea += cross
    centroidX += (current[0] + next[0]) * cross
    centroidY += (current[1] + next[1]) * cross
  }

  if (Math.abs(twiceArea) < 0.0001) {
    return null
  }

  return {
    x: centroidX / (3 * twiceArea),
    y: centroidY / (3 * twiceArea),
    area: Math.abs(twiceArea / 2),
  }
}

/**
 * مرکز وزنی یک استان.
 *
 * در MultiPolygon مانند هرمزگان، جزیره‌ها نیز وجود دارند؛
 * اما بخش اصلی با توجه به مساحت بیشتر، وزن بیشتری می‌گیرد.
 */
function centroidOf(rings: LinearRing[]): [number, number] {
  if (rings.length === 0) {
    return [0, 0]
  }

  let weightedX = 0
  let weightedY = 0
  let totalArea = 0

  for (const ring of rings) {
    const centroid = polygonCentroid(ring)

    if (!centroid || centroid.area <= 0) {
      continue
    }

    weightedX += centroid.x * centroid.area
    weightedY += centroid.y * centroid.area
    totalArea += centroid.area
  }

  if (totalArea > 0) {
    return [
      weightedX / totalArea,
      weightedY / totalArea,
    ]
  }

  /*
   * fallback برای داده‌های ناقص یا چندضلعی‌های با مساحت صفر.
   */
  const fallbackRing = normalizeRing(rings[0])

  if (fallbackRing.length === 0) {
    return [0, 0]
  }

  const [sumX, sumY] = fallbackRing.reduce<[number, number]>(
    ([currentX, currentY], point) => {
      const [x, y] = project(point)

      return [currentX + x, currentY + y]
    },
    [0, 0],
  )

  return [
    sumX / fallbackRing.length,
    sumY / fallbackRing.length,
  ]
}

function featureIdOf(feature: IranProvinceFeature): string {
  return String(
    feature.id ??
      feature.properties.id ??
      feature.properties.name ??
      feature.properties.NAME_ENG ??
      '',
  )
}

export const MAP_FEATURES: MapFeature[] = geojson.features
  .map((feature) => {
    const id = featureIdOf(feature)
    const meta = provinceMeta[id]

    const allRings = allRingsOf(feature.geometry)
    const outerRings = outerRingsOf(feature.geometry)

    const fallbackName =
      feature.properties.name ??
      feature.properties.NAME_ENG ??
      id

    return {
      id,
      nameFa: meta?.nameFa ?? fallbackName,
      nameEn: meta?.nameEn ?? feature.properties.NAME_ENG ?? fallbackName,
      d: allRings.map(ringToPath).filter(Boolean).join(' '),
      centroid: centroidOf(outerRings),
    }
  })
  .filter((feature) => Boolean(feature.id && feature.d))

export const FEATURE_BY_ID: Record<string, MapFeature> = Object.fromEntries(
  MAP_FEATURES.map((feature) => [feature.id, feature]),
)