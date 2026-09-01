import { useMemo } from 'react'
import type { MapFeature } from './map-geometry'

interface Props {
  features: MapFeature[]
  hoveredId?: string | null
  featuredId?: string | null
}

/**
 * برچسب استان‌ها بر اساس label محاسبه‌شده در map-geometry.
 */
export function ProvinceLabels({
  features,
  hoveredId = null,
  featuredId = null,
}: Props) {
  const labels = useMemo(
    () =>
      features.map((feature) => ({
        id: feature.id,
        ...feature.label,
      })),
    [features],
  )

  return (
    <g className="province-label-layer" aria-hidden="true">
      {labels.map((label) => {
        const className = [
          'province-label',
          label.mode === 'double' && 'is-double',
          label.mode === 'rotate' && 'is-rotated',
          hoveredId === label.id && 'is-hovered',
          featuredId === label.id && 'is-featured',
        ]
          .filter(Boolean)
          .join(' ')

        const transform =
          label.rotate !== 0
            ? `rotate(${label.rotate} ${label.x} ${label.y})`
            : undefined

        if (label.mode === 'double' && label.line1 && label.line2) {
          return (
            <text
              key={`label-${label.id}`}
              x={label.x}
              y={label.y}
              transform={transform}
              className={className}
            >
              <tspan x={label.x} dy="-0.55em">
                {label.line1}
              </tspan>

              <tspan x={label.x} dy="1.2em">
                {label.line2}
              </tspan>
            </text>
          )
        }

        return (
          <text
            key={`label-${label.id}`}
            x={label.x}
            y={label.y}
            transform={transform}
            className={className}
          >
            {label.text}
          </text>
        )
      })}
    </g>
  )
}