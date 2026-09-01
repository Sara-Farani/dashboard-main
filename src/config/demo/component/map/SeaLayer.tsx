import {
  IRAN_SEAS,
  type GeoPoint,
  type SeaCoastline,
} from './iran.seas'

import '../../../../styles/iran.seas.css'

type SvgPoint = [x: number, y: number]

type ProjectFn = (
  lonLat: GeoPoint,
) => SvgPoint | null

interface SeaLayerProps {
  project: ProjectFn

  /**
   * برای سازگاری با استفاده‌های قبلی نگه داشته شده است.
   * در نسخه جدید، آب شفاف است و overlap استفاده نمی‌شود.
   */
  iranWaterOverlap?: number

  /**
   * میزان ناهمواری خطوط ساحلی کشورهای اطراف.
   */
  coastlineRoughness?: number
}

function projectPoints(
  points: GeoPoint[],
  project: ProjectFn,
): SvgPoint[] {
  const projectedPoints: SvgPoint[] = []

  for (const point of points) {
    const projected = project(point)

    if (projected) {
      projectedPoints.push(projected)
    }
  }

  return projectedPoints
}

function svgPointsToPath(
  points: SvgPoint[],
  closed: boolean,
): string {
  const minimumPoints = closed ? 3 : 2

  if (points.length < minimumPoints) {
    return ''
  }

  const commands = points.map(
    ([x, y], index) => {
      const command = index === 0 ? 'M' : 'L'

      return `${command}${x.toFixed(2)},${y.toFixed(2)}`
    },
  )

  return `${commands.join(' ')}${closed ? ' Z' : ''}`
}

function pointsToPath(
  points: GeoPoint[],
  project: ProjectFn,
  closed: boolean,
): string {
  return svgPointsToPath(
    projectPoints(points, project),
    closed,
  )
}

function hashText(value: string): number {
  let hash = 2166136261

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function seededNoise(seed: number): number {
  let value = seed

  value = Math.imul(
    value ^ (value >>> 16),
    2246822507,
  )

  value = Math.imul(
    value ^ (value >>> 13),
    3266489909,
  )

  value ^= value >>> 16

  return (value >>> 0) / 4294967295
}

function pointDistance(
  first: SvgPoint,
  second: SvgPoint,
): number {
  return Math.hypot(
    second[0] - first[0],
    second[1] - first[1],
  )
}

/**
 * ساخت مسیر ساحلی با ناهمواری بسیار ملایم.
 */
function roughPointsToPath(
  points: GeoPoint[],
  project: ProjectFn,
  closed: boolean,
  roughness: number,
  seedKey: string,
): string {
  const projectedPoints = projectPoints(
    points,
    project,
  )

  const minimumPoints = closed ? 3 : 2

  if (projectedPoints.length < minimumPoints) {
    return ''
  }

  if (roughness <= 0) {
    return svgPointsToPath(
      projectedPoints,
      closed,
    )
  }

  const seed = hashText(seedKey)
  const roughPoints: SvgPoint[] = []

  const segmentCount = closed
    ? projectedPoints.length
    : projectedPoints.length - 1

  for (
    let segmentIndex = 0;
    segmentIndex < segmentCount;
    segmentIndex += 1
  ) {
    const start = projectedPoints[segmentIndex]

    const end =
      projectedPoints[
        (segmentIndex + 1) %
          projectedPoints.length
      ]

    const deltaX = end[0] - start[0]
    const deltaY = end[1] - start[1]

    const segmentLength = pointDistance(
      start,
      end,
    )

    if (segmentLength <= 0.001) {
      continue
    }

    const subdivisions = Math.max(
      2,
      Math.ceil(segmentLength / 7),
    )

    const normalX = -deltaY / segmentLength
    const normalY = deltaX / segmentLength

    if (roughPoints.length === 0) {
      roughPoints.push(start)
    }

    for (
      let step = 1;
      step <= subdivisions;
      step += 1
    ) {
      const progress = step / subdivisions

      if (step === subdivisions) {
        roughPoints.push(end)
        continue
      }

      const baseX =
        start[0] + deltaX * progress

      const baseY =
        start[1] + deltaY * progress

      const localSeed =
        seed +
        segmentIndex * 104729 +
        step * 13007

      const randomValue =
        seededNoise(localSeed) * 2 - 1

      const wave =
        Math.sin(
          progress * Math.PI * 2.3 +
            segmentIndex * 1.19,
        ) * 0.34

      const edgeEnvelope =
        Math.sin(progress * Math.PI)

      const offset =
        (randomValue * 0.8 + wave) *
        roughness *
        edgeEnvelope

      roughPoints.push([
        baseX + normalX * offset,
        baseY + normalY * offset,
      ])
    }
  }

  return svgPointsToPath(
    roughPoints,
    closed,
  )
}

function coastlineClassName(
  coastline: SeaCoastline,
): string {
  return [
    'foreign-coastline',
    `foreign-coastline-${coastline.countryCode.toLowerCase()}`,
  ].join(' ')
}

export function SeaLayer({
  project,
  coastlineRoughness = 0,
}: SeaLayerProps) {
  const safeRoughness = Math.max(
    0,
    Math.min(coastlineRoughness, 2.8),
  )

  return (
    <g
      className="sea-layer"
      aria-hidden="true"
      pointerEvents="none"
    >
      {IRAN_SEAS.map((sea) => {
        const waterPath = pointsToPath(
          sea.waterBoundary,
          project,
          true,
        )

        const iranCoastPath = pointsToPath(
          sea.iranCoastline,
          project,
          false,
        )

        const labelPosition = project(sea.label)

        if (!waterPath || !labelPosition) {
          return null
        }

        return (
          <g
            key={sea.id}
            className={[
              'sea-group',
              `sea-group-${sea.id}`,
            ].join(' ')}
            data-sea={sea.id}
          >
            {/*
              آب شفاف است و هیچ stroke ندارد.

              دلیل:
              waterBoundary یک مسیر بسته است؛ اگر برای آن stroke
              بگذاریم، خط خارجی مسیر از جمله خط بالای دریای خزر
              دیده خواهد شد.

              با حذف stroke، رنگ دریا دقیقاً همان رنگ پس‌زمینه خواهد بود
              و هیچ مرز مصنوعی در قسمت بالایی خزر ایجاد نمی‌شود.
            */}
            <path
              className={[
                'sea-water',
                sea.className,
              ].join(' ')}
              d={waterPath}
            />

            {/*
              در صورت نیاز به نمایش خشکی یا جزیره‌های کشورهای اطراف.
            */}
            <g className="sea-land-patch-layer">
              {(sea.landPatches ?? []).map(
                (patch) => {
                  const patchPath = roughPointsToPath(
                    patch.coordinates,
                    project,
                    true,
                    safeRoughness * 0.35,
                    `${sea.id}-${patch.id}`,
                  )

                  if (!patchPath) {
                    return null
                  }

                  return (
                    <path
                      key={patch.id}
                      className={[
                        'sea-land-patch',
                        `sea-land-patch-${patch.countryCode.toLowerCase()}`,
                      ].join(' ')}
                      d={patchPath}
                      data-country-code={patch.countryCode}
                      data-country-name={patch.countryNameFa}
                      vectorEffect="non-scaling-stroke"
                    >
                      <title>{patch.countryNameFa}</title>
                    </path>
                  )
                },
              )}
            </g>

            {/*
              مرز کشورهای اطراف دریا.

              این خطوط همان رنگ و ضخامت مرز ایران را از CSS
              دریافت می‌کنند.
            */}
            <g className="foreign-coastline-layer">
              {sea.foreignCoastlines.map(
                (coastline) => {
                  const coastlinePath = roughPointsToPath(
                    coastline.coordinates,
                    project,
                    coastline.closed ?? false,
                    safeRoughness,
                    `${sea.id}-${coastline.id}`,
                  )

                  if (!coastlinePath) {
                    return null
                  }

                  return (
                    <g
                      key={coastline.id}
                      className={coastlineClassName(
                        coastline,
                      )}
                      data-country-code={
                        coastline.countryCode
                      }
                      data-country-name={
                        coastline.countryNameFa
                      }
                    >
                      <title>
                        {coastline.countryNameFa}
                      </title>

                      <path
                        className="foreign-coastline-line"
                        d={coastlinePath}
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  )
                },
              )}
            </g>

            {/*
              این مسیر عمداً پنهان است؛ چون مرز ایران از لایه اصلی
              نقشه ایران باید نمایش داده شود، نه از لایه دریا.
            */}
            {iranCoastPath && (
              <path
                className="iran-sea-coastline"
                d={iranCoastPath}
                vectorEffect="non-scaling-stroke"
              />
            )}

            <text
              className={sea.labelClassName}
              x={labelPosition[0]}
              y={labelPosition[1]}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {sea.nameFa}
            </text>
          </g>
        )
      })}
    </g>
  )
}