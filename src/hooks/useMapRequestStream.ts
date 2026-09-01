import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ORIGINS,
  PURPOSES,
  pick,
  randomAmount,
  randomRecipientCount,
} from '../data/map.origins'
import { pickWeightedProvince } from '../data/map.provinces'
import { requestCode } from '../utils/format'
import type { LiveRequest, RequestStatus } from '../config/demo/component/map/IranMap.card'

const INCOMING_MS = 1100
const MAX_HISTORY = 48

export interface RequestItem extends LiveRequest {
  origin: string
  purpose: string
  amount: number
  recipients: number
  createdAt: number
  startedAt: number | null
  completedAt: number | null
  duration: number
}

export interface RequestStreamTotals {
  today: number
  processing: number
  incoming: number
  activeProvinces: number
  volume: number
  recipients: number
  completed: number
}

function durationFor(amount: number): number {
  const base = 4200 + Math.min(amount / 8_000_000, 5500)

  return base + Math.random() * 1800
}

let sequence = 1280

function createRequest(
  now: number,
  status: RequestStatus = 'incoming',
): RequestItem {
  sequence += 1

  const province = pickWeightedProvince()
  const amount = randomAmount()

  return {
    id: requestCode(sequence),
    provinceId: String(province.id),
    provinceName: province.nameFa,
    origin: pick(ORIGINS),
    purpose: pick(PURPOSES),
    amount,
    recipients: randomRecipientCount(amount),
    status,
    createdAt: now,
    startedAt: status === 'processing' ? now : null,
    completedAt: null,
    duration: durationFor(amount),
  }
}

function seedHistory(now: number): RequestItem[] {
  const seeded: RequestItem[] = []

  for (let index = 0; index < 7; index += 1) {
    const age = 18_000 + index * 7_000 + Math.random() * 4000
    const request = createRequest(now - age, 'completed')

    request.startedAt = request.createdAt + 800
    request.completedAt = request.startedAt + request.duration

    seeded.push(request)
  }

  const liveRequest = createRequest(now - 900, 'processing')
  liveRequest.startedAt = now - 900
  seeded.push(liveRequest)

  if (Math.random() > 0.35) {
    const extraRequest = createRequest(now - 400, 'processing')
    extraRequest.startedAt = now - 400
    seeded.push(extraRequest)
  }

  return seeded
}

export function useMapRequestStream() {
  const [now, setNow] = useState<number>(() => Date.now())
  const [paused, setPaused] = useState<boolean>(false)
  const [requests, setRequests] = useState<RequestItem[]>(() =>
    seedHistory(Date.now()),
  )

  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 80)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    setRequests((previous) => {
      let changed = false

      const next = previous.map((request): RequestItem => {
        if (
          request.status === 'incoming' &&
          now - request.createdAt >= INCOMING_MS
        ) {
          changed = true

          return {
            ...request,
            status: 'processing',
            startedAt: request.startedAt ?? now,
          }
        }

        if (
          request.status === 'processing' &&
          request.startedAt !== null &&
          now - request.startedAt >= request.duration
        ) {
          changed = true

          return {
            ...request,
            status: 'completed',
            completedAt: now,
          }
        }

        return request
      })

      return changed ? next : previous
    })
  }, [now])

  const spawn = useCallback((count = 1) => {
    const stamp = Date.now()

    setRequests((previous) => {
      const next = [...previous]

      for (let index = 0; index < count; index += 1) {
        next.push(createRequest(stamp + index * 40))
      }

      return next.slice(-MAX_HISTORY)
    })
  }, [])

  useEffect(() => {
    let timer: number | undefined

    const scheduleNext = () => {
      const wait = 1700 + Math.random() * 2800

      timer = window.setTimeout(() => {
        if (!pausedRef.current) {
          const isBurst = Math.random() < 0.22
          const count = isBurst ? 2 + Math.floor(Math.random() * 3) : 1

          spawn(count)
        }

        scheduleNext()
      }, wait)
    }

    scheduleNext()

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer)
      }
    }
  }, [spawn])

  const live = useMemo<LiveRequest[]>(
    () =>
      requests.filter(
        (request) =>
          request.status === 'incoming' || request.status === 'processing',
      ),
    [requests],
  )

  const processing = useMemo<RequestItem[]>(
    () => requests.filter((request) => request.status === 'processing'),
    [requests],
  )

  const featured = useMemo<RequestItem | null>(() => {
    if (processing.length === 0) {
      return (live[live.length - 1] as RequestItem | undefined) ?? null
    }

    return [...processing].sort(
      (a, b) => (b.startedAt ?? 0) - (a.startedAt ?? 0),
    )[0]
  }, [live, processing])

  const countsByProvince = useMemo<Record<string, number>>(() => {
    const result: Record<string, number> = {}

    for (const request of requests) {
      const provinceId = String(request.provinceId)

      result[provinceId] = (result[provinceId] ?? 0) + 1
    }

    return result
  }, [requests])

  const totals = useMemo<RequestStreamTotals>(() => {
    const completed = requests.filter(
      (request) => request.status === 'completed',
    )

    const volume = requests.reduce(
      (sum, request) => sum + request.amount,
      0,
    )

    const recipients = requests.reduce(
      (sum, request) => sum + request.recipients,
      0,
    )

    const activeProvinces = new Set(
      live.map((request) => request.provinceId),
    ).size

    return {
      today: requests.length,
      processing: processing.length,
      incoming: requests.filter((request) => request.status === 'incoming')
        .length,
      activeProvinces,
      volume,
      recipients,
      completed: completed.length,
    }
  }, [live, processing, requests])

  return {
    now,
    paused,
    setPaused,
    requests,
    live,
    processing,
    featured,
    countsByProvince,
    totals,
    spawn,
  }
}