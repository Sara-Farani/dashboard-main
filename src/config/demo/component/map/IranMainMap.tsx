import {
  useMemo,
  useState,
  type MouseEvent,
} from 'react'

import {
  FEATURE_BY_ID,
  MAP_FEATURES,
  MAP_VIEWBOX,
  projectNullable,
} from './map-geometry'
import { ProvinceLabels } from './ProvinceLabels'
import { SeaLayer } from './SeaLayer'
import { formatNumber } from '../../../../utils/format'

import '../../../../styles/iran.main.map.css'

export type RequestStatus =
  | 'incoming'
  | 'processing'
  | 'completed'

export interface LiveRequest {
  id: string
  provinceId: string | number
  provinceName: string
  status: RequestStatus
}

interface IranMapProps {
  live: LiveRequest[]
  featured?: LiveRequest | null
  countsByProvince: Record<string, number>
  hoveredId?: string | null
  onHover: (provinceId: string | null) => void
}

interface MapTooltip {
  id: string
  name: string
  x: number
  y: number
  count: number
  live: number
}

function intensityClass(count = 0): string {
  if (count <= 0) {
    return 'heat-0'
  }

  if (count === 1) {
    return 'heat-1'
  }

  if (count === 2) {
    return 'heat-2'
  }

  if (count <= 4) {
    return 'heat-3'
  }

  return 'heat-4'
}

export default function IranMainMap({
  live,
  featured = null,
  countsByProvince,
  hoveredId = null,
  onHover,
}: IranMapProps) {
  const [tip, setTip] = useState<MapTooltip | null>(null)

  const byProvince = useMemo<Record<string, LiveRequest[]>>(() => {
    const result: Record<string, LiveRequest[]> = {}

    for (const request of live) {
      const provinceId = String(request.provinceId)

      if (!result[provinceId]) {
        result[provinceId] = []
      }

      result[provinceId].push(request)
    }

    return result
  }, [live])

  const featuredProvinceId = String(
    featured?.provinceId ?? '',
  )

  const getPosition = (
    event: MouseEvent<SVGPathElement>,
  ): {
    x: number
    y: number
  } => {
    const svg = event.currentTarget.ownerSVGElement

    if (!svg) {
      return {
        x: 0,
        y: 0,
      }
    }

    const stageBox = svg
      .closest('.map-stage')
      ?.getBoundingClientRect()

    const svgBox = svg.getBoundingClientRect()

    return {
      x:
        event.clientX -
        (stageBox?.left ?? svgBox.left),

      y:
        event.clientY -
        (stageBox?.top ?? svgBox.top),
    }
  }

  const handleProvinceEnter = (
    event: MouseEvent<SVGPathElement>,
    provinceId: string,
    provinceName: string,
    liveCount: number,
  ) => {
    const position = getPosition(event)

    onHover(provinceId)

    setTip({
      id: provinceId,
      name: provinceName,
      x: position.x,
      y: position.y,
      count: countsByProvince[provinceId] ?? 0,
      live: liveCount,
    })
  }

  const handleProvinceMove = (
    event: MouseEvent<SVGPathElement>,
  ) => {
    const position = getPosition(event)

    setTip((previous) => {
      if (!previous) {
        return null
      }

      return {
        ...previous,
        x: position.x,
        y: position.y,
      }
    })
  }

  const handleMapLeave = () => {
    onHover(null)
    setTip(null)
  }

  return (
    <div className="map-stage">
      <div
        className="map-aurora"
        aria-hidden="true"
      />

      <div
        className="map-grid"
        aria-hidden="true"
      />

      <div
        className="map-sweep"
        aria-hidden="true"
      />

      <svg
        className="iran-svg"
        viewBox={MAP_VIEWBOX}
        role="img"
        aria-label="نقشه استان‌های ایران، دریاهای پیرامونی و وضعیت درخواست‌ها"
        preserveAspectRatio="xMidYMid meet"
        shapeRendering="geometricPrecision"
        onMouseLeave={handleMapLeave}
      >
        <defs>
          <filter
            id="glow-gold"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              stdDeviation="6"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter
            id="glow-cyan"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient
            id="core-grad"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop
              offset="0%"
              stopColor="#fff4cc"
              stopOpacity="0.9"
            />

            <stop
              offset="55%"
              stopColor="#f5c15a"
              stopOpacity="0.35"
            />

            <stop
              offset="100%"
              stopColor="#f5c15a"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>

        {/*
          آب با ضخامت زیاد زیر استان‌های ساحلی ادامه پیدا می‌کند.

          مقدار 110 باعث پوشانده‌شدن فضای خالی میان خوزستان و بوشهر
          و همچنین قسمت پایین هرمزگان می‌شود.

          چون استان‌ها بعد از SeaLayer رسم می‌شوند، قسمت اضافه آب
          در داخل خشکی قابل مشاهده نخواهد بود.
        */}
        <SeaLayer
          project={projectNullable}
          iranWaterOverlap={110}
          coastlineRoughness={1.15}
        />

        <g
          className="glow-layer"
          aria-hidden="true"
          pointerEvents="none"
        >
          {MAP_FEATURES.map((feature) => {
            const requests = byProvince[feature.id]

            if (!requests?.length) {
              return null
            }

            const isFeatured =
              feature.id === featuredProvinceId

            return (
              <path
                key={`glow-${feature.id}`}
                d={feature.d}
                fillRule="evenodd"
                clipRule="evenodd"
                className={[
                  'province-glow',
                  isFeatured
                    ? 'is-featured'
                    : 'is-live',
                ].join(' ')}
                filter={
                  isFeatured
                    ? 'url(#glow-gold)'
                    : 'url(#glow-cyan)'
                }
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </g>

        <g className="land-layer">
          {MAP_FEATURES.map((feature) => {
            const requests =
              byProvince[feature.id] ?? []

            const isFeatured =
              feature.id === featuredProvinceId

            const isIncoming = requests.some(
              (request) =>
                request.status === 'incoming',
            )

            const isLive = requests.length > 0

            const heat = intensityClass(
              countsByProvince[feature.id] ?? 0,
            )

            return (
              <path
                key={feature.id}
                d={feature.d}
                fillRule="evenodd"
                clipRule="evenodd"
                className={[
                  'province',
                  heat,
                  isLive && 'is-live',
                  isFeatured && 'is-featured',
                  isIncoming && 'is-incoming',
                  hoveredId === feature.id &&
                    'is-hovered',
                ]
                  .filter(Boolean)
                  .join(' ')}
                vectorEffect="non-scaling-stroke"
                data-province-id={feature.id}
                data-province-name={feature.nameFa}
                tabIndex={0}
                onMouseEnter={(event) =>
                  handleProvinceEnter(
                    event,
                    feature.id,
                    feature.nameFa,
                    requests.length,
                  )
                }
                onMouseMove={handleProvinceMove}
                onFocus={() => {
                  onHover(feature.id)
                }}
                onBlur={() => {
                  onHover(null)
                  setTip(null)
                }}
              >
                <title>{feature.nameFa}</title>
              </path>
            )
          })}
        </g>

        <ProvinceLabels
          features={MAP_FEATURES}
          hoveredId={hoveredId}
          featuredId={
            featuredProvinceId || null
          }
        />

        <g
          className="marker-layer"
          aria-hidden="true"
          pointerEvents="none"
        >
          {live.map((request) => {
            const provinceId = String(
              request.provinceId,
            )

            const feature =
              FEATURE_BY_ID[provinceId]

            if (!feature) {
              return null
            }

            const [cx, cy] = feature.centroid

            const isFeatured =
              featured?.id === request.id

            return (
              <g
                key={`marker-${request.id}`}
                className={[
                  'pulse-mark',
                  request.status,
                  isFeatured && 'featured',
                ]
                  .filter(Boolean)
                  .join(' ')}
                transform={`translate(${cx} ${cy})`}
              >
                {isFeatured && (
                  <circle
                    className="halo"
                    r="28"
                    fill="url(#core-grad)"
                  />
                )}

                <circle
                  className="ring ring-a"
                  r="18"
                  vectorEffect="non-scaling-stroke"
                />

                <circle
                  className="ring ring-b"
                  r="18"
                  vectorEffect="non-scaling-stroke"
                />

                <circle
                  className="core"
                  r="4.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )
          })}
        </g>
      </svg>

      {tip && (
        <div
          className="map-tip"
          style={{
            left: tip.x,
            top: tip.y,
          }}
          data-province-id={tip.id}
          role="status"
        >
          <strong>{tip.name}</strong>

          <span>
            {formatNumber(tip.count)} درخواست امروز
          </span>

          {tip.live > 0 && (
            <em>
              {formatNumber(tip.live)} جریان فعال
            </em>
          )}
        </div>
      )}

      <div
        className="map-legend"
        aria-label="راهنمای نقشه"
      >
        <span>
          <i
            className="dot gold"
            aria-hidden="true"
          />

          استان در حال واریز
        </span>

        <span>
          <i
            className="dot cyan"
            aria-hidden="true"
          />

          درخواست همزمان
        </span>

        <span>
          <i
            className="dot heat"
            aria-hidden="true"
          />

          تراکم امروز
        </span>
      </div>
    </div>
  )
}