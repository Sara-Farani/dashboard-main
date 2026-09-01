import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { Fullscreen, Minimize } from 'lucide-react'

import { useMapRequestStream } from '../../../../hooks/useMapRequestStream'

import HeaderMap from './HeaderMap'
import StatsBar from './StatsBar'
import RequestFeed from './RequestFeed'
import IranMainMap from './IranMainMap'
import FeaturedRequest from './FeaturedRequest'

import '../../../../styles/iran.map.card.css'

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}

export default function IranMapCard() {
  const stream = useMapRequestStream()

  const cardRef = useRef<HTMLElement | null>(null)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState<string | null>(null)

  const handleHover = (provinceId: string | number | null) => {
    setHoveredId(provinceId === null ? null : String(provinceId))
  }

  const isCurrentCardFullscreen = useCallback(() => {
    const fullscreenDocument = document as FullscreenDocument

    return (
      document.fullscreenElement === cardRef.current ||
      fullscreenDocument.webkitFullscreenElement === cardRef.current
    )
  }, [])

  useEffect(() => {
    const synchronizeFullscreenState = () => {
      const isCurrentFullscreen = isCurrentCardFullscreen()

      setIsFullscreen(isCurrentFullscreen)
      setHoveredId(null)

      if (isCurrentFullscreen) {
        setFullscreenError(null)
      }
    }

    const handleFullscreenError = () => {
      setIsFullscreen(false)
      setFullscreenError(
        'امکان ورود به حالت تمام‌صفحه وجود ندارد. لطفاً تنظیمات مرورگر را بررسی کنید.',
      )
    }

    document.addEventListener(
      'fullscreenchange',
      synchronizeFullscreenState,
    )

    document.addEventListener(
      'fullscreenerror',
      handleFullscreenError,
    )

    document.addEventListener(
      'webkitfullscreenchange',
      synchronizeFullscreenState as EventListener,
    )

    document.addEventListener(
      'webkitfullscreenerror',
      handleFullscreenError as EventListener,
    )

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        synchronizeFullscreenState,
      )

      document.removeEventListener(
        'fullscreenerror',
        handleFullscreenError,
      )

      document.removeEventListener(
        'webkitfullscreenchange',
        synchronizeFullscreenState as EventListener,
      )

      document.removeEventListener(
        'webkitfullscreenerror',
        handleFullscreenError as EventListener,
      )
    }
  }, [isCurrentCardFullscreen])

  const enterFullscreen = async () => {
    const cardElement = cardRef.current as FullscreenElement | null

    if (!cardElement) {
      return
    }

    try {
      setFullscreenError(null)

      if (cardElement.requestFullscreen) {
        await cardElement.requestFullscreen({
          navigationUI: 'hide',
        })

        return
      }

      if (cardElement.webkitRequestFullscreen) {
        await cardElement.webkitRequestFullscreen()

        return
      }

      setFullscreenError(
        'مرورگر شما از قابلیت نمایش تمام‌صفحه پشتیبانی نمی‌کند.',
      )
    } catch {
      setFullscreenError(
        'ورود به حالت تمام‌صفحه انجام نشد. لطفاً دوباره تلاش کنید.',
      )
    }
  }

  const exitFullscreen = async () => {
    const fullscreenDocument = document as FullscreenDocument

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()

        return
      }

      if (fullscreenDocument.webkitFullscreenElement) {
        await fullscreenDocument.webkitExitFullscreen?.()
      }
    } catch {
      setFullscreenError(
        'خروج از حالت تمام‌صفحه انجام نشد. کلید Esc را امتحان کنید.',
      )
    }
  }

  const handleToggleFullscreen = async () => {
    setHoveredId(null)

    if (isCurrentCardFullscreen()) {
      await exitFullscreen()

      return
    }

    await enterFullscreen()
  }

  const cardClassName = [
    'iran-map-card',
    'ops-shell',
    isFullscreen ? 'is-expanded' : 'is-compact',
  ]
    .filter(Boolean)
    .join(' ')

  const cardStyle = {
    '--map-card-z-index': isFullscreen ? 2147483647 : 'auto',
  } as CSSProperties

  return (
    <section
      ref={cardRef}
      className={cardClassName}
      style={cardStyle}
      dir="rtl"
      aria-label="سامانه پایش زنده واریز گروهی"
    >
      {isFullscreen && (
        <>
          <div className="bg-noise" />
          <div className="bg-vignette" />
        </>
      )}

      <button
        type="button"
        className="map-fullscreen-button"
        onClick={handleToggleFullscreen}
        title={
          isFullscreen
            ? 'خروج از حالت تمام‌صفحه'
            : 'نمایش در حالت تمام‌صفحه'
        }
        aria-label={
          isFullscreen
            ? 'خروج از حالت تمام‌صفحه'
            : 'نمایش در حالت تمام‌صفحه'
        }
      >
        {isFullscreen ? (
          <Minimize
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
          />
        ) : (
          <Fullscreen
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
          />
        )}

        <span>
          {isFullscreen ? 'خروج از تمام‌صفحه' : 'بزرگنمایی'}
        </span>
      </button>

      {fullscreenError && (
        <div className="fullscreen-error" role="alert">
          {fullscreenError}
        </div>
      )}

      {isFullscreen && (
        <>
          <HeaderMap
            now={stream.now}
            paused={stream.paused}
            onToggle={() => stream.setPaused((value) => !value)}
            onBurst={() => stream.spawn(3)}
          />

          <StatsBar totals={stream.totals} />
        </>
      )}

      <main
        className={[
          'ops-grid',
          isFullscreen ? 'ops-grid-expanded' : 'ops-grid-compact',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isFullscreen && (
          <RequestFeed
            requests={stream.requests}
            featuredId={stream.featured?.id ?? null}
            onHover={handleHover}
          />
        )}

        <IranMainMap
          live={stream.live}
          featured={stream.featured}
          countsByProvince={stream.countsByProvince}
          hoveredId={hoveredId}
          onHover={handleHover}
        />

        {isFullscreen && (
          <FeaturedRequest
            request={stream.featured}
            now={stream.now}
            concurrent={stream.processing}
          />
        )}
      </main>
    </section>
  )
}