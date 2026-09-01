// ------------------------------------------------------------------
// Numeric animation hook — counts from 0 to target when target changes.
// Mirrors Persian digits formatting onto the animated value.
// ------------------------------------------------------------------

import { useEffect, useRef, useState } from 'react'
import { formatFaNumber } from '../utils/formatters'

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

export default function useCountUp(target: number, duration = 1600, startOnMount = true) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number | undefined>(undefined)
  const [started, setStarted] = useState(!startOnMount)

  useEffect(() => {
    if (!started) {
      setStarted(true)
      return
    }
    const from = 0
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = easeOutExpo(progress)
      setDisplay(from + (target - from) * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current!)
  }, [target, started, duration])

  return { value: formatFaNumber(Math.round(display)) }
}