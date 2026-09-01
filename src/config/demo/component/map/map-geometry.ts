import geojsonData from '../../../../data/iran.provinces.json'
import { getAllSeaPoints } from './iran.seas'
import {
  getProvinceNameFa,
  type ProvinceLabelMode,
  type ProvinceNameConfig,
} from './province-names.fa'

import type {
  IranGeometry,
  IranProvinceFeature,
  IranProvinceFeatureCollection,
  LinearRing,
  Position,
} from '../../../../types/iran-provinces.types'

interface Bounds {
  minLon: number
  maxLon: number
  minLat: number
  maxLat: number
}

export type LabelMode = ProvinceLabelMode

export interface ProvinceLabelInfo {
  mode: LabelMode
  text: string
  line1?: string
  line2?: string
  rotate: number
  x: number
  y: number
}

export interface MapFeature {
  id: string
  nameFa: string
  nameEn: string
  d: string
  centroid: [x: number, y: number]
  label: ProvinceLabelInfo
}

const geojson =
  geojsonData as unknown as IranProvinceFeatureCollection

const VIEW_WIDTH = 1000
const VIEW_HEIGHT = 920
const SVG_PADDING = 28

/**
 * ضریب اصلاح طول جغرافیایی برای جلوگیری از کشیدگی افقی نقشه.
 */
const LATITUDE_MIDDLE = 32.4

const LONGITUDE_SCALE = Math.cos(
  (LATITUDE_MIDDLE * Math.PI) / 180,
)

function allRingsOf(geometry: IranGeometry): LinearRing[] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates
  }

  return geometry.coordinates.flat()
}

function outerRingsOf(geometry: IranGeometry): LinearRing[] {
  if (geometry.type === 'Polygon') {
    return geometry.coordinates.length > 0
      ? [geometry.coordinates[0]]
      : []
  }

  return geometry.coordinates
    .map((polygon) => polygon[0])
    .filter((ring): ring is LinearRing => Boolean(ring?.length))
}

function createEmptyBounds(): Bounds {
  return {
    minLon: Number.POSITIVE_INFINITY,
    maxLon: Number.NEGATIVE_INFINITY,
    minLat: Number.POSITIVE_INFINITY,
    maxLat: Number.NEGATIVE_INFINITY,
  }
}

function includePosition(
  bounds: Bounds,
  position: Position,
): void {
  const [longitude, latitude] = position

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return
  }

  bounds.minLon = Math.min(bounds.minLon, longitude)
  bounds.maxLon = Math.max(bounds.maxLon, longitude)
  bounds.minLat = Math.min(bounds.minLat, latitude)
  bounds.maxLat = Math.max(bounds.maxLat, latitude)
}

function assertValidBounds(
  bounds: Bounds,
  errorMessage: string,
): Bounds {
  const valid =
    Number.isFinite(bounds.minLon) &&
    Number.isFinite(bounds.maxLon) &&
    Number.isFinite(bounds.minLat) &&
    Number.isFinite(bounds.maxLat)

  if (!valid) {
    throw new Error(errorMessage)
  }

  return bounds
}

function boundsOfProvinceFeatures(
  features: IranProvinceFeature[],
): Bounds {
  const bounds = createEmptyBounds()

  for (const feature of features) {
    const rings = allRingsOf(feature.geometry)

    for (const ring of rings) {
      for (const position of ring) {
        includePosition(bounds, position)
      }
    }
  }

  return assertValidBounds(
    bounds,
    'Iran provinces GeoJSON does not contain valid coordinates.',
  )
}

function boundsOfSeas(): Bounds {
  const bounds = createEmptyBounds()

  for (const position of getAllSeaPoints()) {
    includePosition(bounds, position)
  }

  return assertValidBounds(
    bounds,
    'Sea definitions do not contain valid coordinates.',
  )
}

function mergeBounds(...items: Bounds[]): Bounds {
  const bounds = createEmptyBounds()

  for (const item of items) {
    bounds.minLon = Math.min(bounds.minLon, item.minLon)
    bounds.maxLon = Math.max(bounds.maxLon, item.maxLon)
    bounds.minLat = Math.min(bounds.minLat, item.minLat)
    bounds.maxLat = Math.max(bounds.maxLat, item.maxLat)
  }

  return assertValidBounds(
    bounds,
    'Map does not contain valid geographic bounds.',
  )
}

const provinceBounds = boundsOfProvinceFeatures(
  geojson.features,
)

const seaBounds = boundsOfSeas()

const contentBounds = mergeBounds(
  provinceBounds,
  seaBounds,
)

/**
 * فضای اضافه اطراف نقشه برای جلوگیری از بریده‌شدن خطوط مرزی.
 */
const GEOGRAPHIC_PADDING_LONGITUDE = 0.26
const GEOGRAPHIC_PADDING_NORTH = 0.24
const GEOGRAPHIC_PADDING_SOUTH = 0.24

const viewBounds: Bounds = {
  minLon:
    contentBounds.minLon -
    GEOGRAPHIC_PADDING_LONGITUDE,

  maxLon:
    contentBounds.maxLon +
    GEOGRAPHIC_PADDING_LONGITUDE,

  minLat:
    contentBounds.minLat -
    GEOGRAPHIC_PADDING_SOUTH,

  maxLat:
    contentBounds.maxLat +
    GEOGRAPHIC_PADDING_NORTH,
}

const longitudeSpan =
  (viewBounds.maxLon - viewBounds.minLon) *
  LONGITUDE_SCALE

const latitudeSpan =
  viewBounds.maxLat - viewBounds.minLat

const usableWidth =
  VIEW_WIDTH - SVG_PADDING * 2

const usableHeight =
  VIEW_HEIGHT - SVG_PADDING * 2

const projectionScale = Math.min(
  usableWidth / Math.max(longitudeSpan, 1),
  usableHeight / Math.max(latitudeSpan, 1),
)

const projectionOffsetX =
  SVG_PADDING +
  (usableWidth - longitudeSpan * projectionScale) / 2

const projectionOffsetY =
  SVG_PADDING +
  (usableHeight - latitudeSpan * projectionScale) / 2

export const MAP_VIEWBOX =
  `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`

export function project(
  position: Position,
): [number, number] {
  const [longitude, latitude] = position

  const x =
    projectionOffsetX +
    (longitude - viewBounds.minLon) *
      LONGITUDE_SCALE *
      projectionScale

  const y =
    projectionOffsetY +
    (viewBounds.maxLat - latitude) *
      projectionScale

  return [x, y]
}

export function projectNullable(
  lonLat: [number, number],
): [number, number] | null {
  const [longitude, latitude] = lonLat

  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude)
  ) {
    return null
  }

  return project(lonLat)
}

function geographicOffsetToSvg(
  offset?: [number, number],
): [number, number] {
  if (!offset) {
    return [0, 0]
  }

  const [longitudeOffset, latitudeOffset] = offset

  return [
    longitudeOffset *
      LONGITUDE_SCALE *
      projectionScale,

    -latitudeOffset * projectionScale,
  ]
}

function ringToPath(ring: LinearRing): string {
  if (ring.length === 0) {
    return ''
  }

  const commands = ring.map((position, index) => {
    const [x, y] = project(position)

    return [
      index === 0 ? 'M' : 'L',
      x.toFixed(2),
      ',',
      y.toFixed(2),
    ].join('')
  })

  return `${commands.join(' ')} Z`
}

function normalizeRing(
  ring: LinearRing,
): LinearRing {
  if (ring.length < 2) {
    return ring
  }

  const first = ring[0]
  const last = ring[ring.length - 1]

  const alreadyClosed =
    first[0] === last[0] &&
    first[1] === last[1]

  return alreadyClosed
    ? ring.slice(0, -1)
    : ring
}

interface PolygonCentroid {
  x: number
  y: number
  area: number
}

function polygonCentroid(
  ring: LinearRing,
): PolygonCentroid | null {
  const points = normalizeRing(ring)

  if (points.length < 3) {
    return null
  }

  let twiceArea = 0
  let centroidX = 0
  let centroidY = 0

  for (
    let index = 0;
    index < points.length;
    index += 1
  ) {
    const current = project(points[index])

    const next = project(
      points[(index + 1) % points.length],
    )

    const cross =
      current[0] * next[1] -
      next[0] * current[1]

    twiceArea += cross

    centroidX +=
      (current[0] + next[0]) * cross

    centroidY +=
      (current[1] + next[1]) * cross
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

function centroidOf(
  rings: LinearRing[],
): [number, number] {
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

  const fallback = normalizeRing(rings[0])

  if (fallback.length === 0) {
    return [0, 0]
  }

  const totals = fallback.reduce<[number, number]>(
    ([sumX, sumY], position) => {
      const [x, y] = project(position)

      return [sumX + x, sumY + y]
    },
    [0, 0],
  )

  return [
    totals[0] / fallback.length,
    totals[1] / fallback.length,
  ]
}

function featureIdOf(
  feature: IranProvinceFeature,
): string {
  return String(
    feature.id ??
      feature.properties.id ??
      feature.properties.name ??
      feature.properties.NAME_ENG ??
      '',
  )
}

function resolveLabel(
  config: ProvinceNameConfig,
  rawCentroid: [number, number],
): ProvinceLabelInfo {
  const [offsetX, offsetY] =
    geographicOffsetToSvg(config.offset)

  const mode: LabelMode =
    config.prefer ??
    (config.line1 && config.line2
      ? 'double'
      : 'single')

  return {
    mode,
    text: config.nameFa,
    line1: config.line1,
    line2: config.line2,
    rotate: config.rotate ?? 0,
    x: rawCentroid[0] + offsetX,
    y: rawCentroid[1] + offsetY,
  }
}

function applyCentroidShift(
  config: ProvinceNameConfig,
  centroid: [number, number],
): [number, number] {
  if (!config.shiftCentroid) {
    return centroid
  }

  const [offsetX, offsetY] =
    geographicOffsetToSvg(config.offset)

  return [
    centroid[0] + offsetX,
    centroid[1] + offsetY,
  ]
}

export const MAP_FEATURES: MapFeature[] =
  geojson.features
    .map((feature) => {
      const id = featureIdOf(feature)

      const allRings =
        allRingsOf(feature.geometry)

      const outerRings =
        outerRingsOf(feature.geometry)

      const fallbackName =
        feature.properties.name ??
        feature.properties.NAME_ENG ??
        id

      const config = getProvinceNameFa(
        id,
        fallbackName,
      )

      const rawCentroid =
        centroidOf(outerRings)

      const centroid = applyCentroidShift(
        config,
        rawCentroid,
      )

      return {
        id,
        nameFa: config.nameFa,
        nameEn:
          config.nameEn ??
          feature.properties.NAME_ENG ??
          fallbackName,

        d: allRings
          .map(ringToPath)
          .filter(Boolean)
          .join(' '),

        centroid,
        label: resolveLabel(
          config,
          rawCentroid,
        ),
      }
    })
    .filter(
      (feature) =>
        Boolean(feature.id) &&
        Boolean(feature.d),
    )

export const FEATURE_BY_ID: Record<
  string,
  MapFeature
> = Object.fromEntries(
  MAP_FEATURES.map((feature) => [
    feature.id,
    feature,
  ]),
)