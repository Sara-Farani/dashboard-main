// ------------------------------------------------------------------
// Mock transaction (deposit) service.
// Generates a realistic array of 200-500 deposits spread over the last
// hour, then supports paginated / filtered fetch. Call getTransactions()
// again at any time to get a fresh snapshot (simulates live data).
// ------------------------------------------------------------------

import type {
  TransactionEntry,
  TransactionsByMinute,
  TimeSeriesPoint,
  TxSummary,
} from '../types/transaction'

const STATUS_POOL = ['deposit', 'deposit', 'deposit', 'transfer', 'withdraw'] as const // weighted toward deposits

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomFloat(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function generateId(): string {
  return `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

/**
 * Generate N transactions (200-500) spread randomly across the last hour.
 * Each entry: { id, amount, status, timestamp }
 */
function generateBatch(): TransactionEntry[] {
  const count = randomInt(200, 500)
  const now = Date.now()
  const oneHourAgo = now - 60 * 60 * 1000
  const txns: TransactionEntry[] = []
  for (let i = 0; i < count; i++) {
    const ts = randomInt(oneHourAgo, now) // random ms in last hour
    txns.push({
      id: generateId(),
      amount: randomFloat(10_000, 50_000_000), // IRR amounts
      status: STATUS_POOL[randomInt(0, STATUS_POOL.length - 1)],
      timestamp: new Date(ts).toISOString(),
    })
  }
  // Sort newest-first for easy UI slicing
  return txns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

// Returns a full snapshot. In a real app this would be an API call.
export async function getTransactions(): Promise<TransactionEntry[]> {
  // Simulate first-fetch loading (500ms) or quick re-poll (200ms)
  await delay(500)
  return generateBatch()
}

/**
 * Convenience helper: returns basic summary stats from an array.
 */
export function summarise(txns: TransactionEntry[]): TxSummary {
  if (!txns.length) return { count: 0, maxPerMinute: 0, avgPerMinute: 0 }
  const byMinute = groupByMinute(txns)
  const counts = Object.values(byMinute)
  return {
    count: txns.length,
    maxPerMinute: Math.max(...counts),
    avgPerMinute: Math.round(counts.reduce((s, v) => s + v, 0) / counts.length),
  }
}

/**
 * Group transactions by minute (HH:mm) → { '14:32': 12, '14:33': 8, … }
 */
export function groupByMinute(txns: TransactionEntry[]): TransactionsByMinute {
  const map: TransactionsByMinute = {}
  for (const tx of txns) {
    const d = new Date(tx.timestamp)
    const key = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    map[key] = (map[key] || 0) + 1
  }
  return map
}

/**
 * Convert groupByMinute result → sorted time-series array:
 * [{ time: '14:32', count: 12 }, …]
 */
export function toTimeSeries(txns: TransactionEntry[]): TimeSeriesPoint[] {
  const map = groupByMinute(txns)
  return Object.entries(map)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => a.time.localeCompare(b.time))
}

/**
 * Filter transactions to only those within `minutesAgo` of now.
 */
export function filterByMinutes(txns: TransactionEntry[], minutesAgo: number): TransactionEntry[] {
  const cutoff = Date.now() - minutesAgo * 60 * 1000
  return txns.filter((t) => new Date(t.timestamp).getTime() >= cutoff)
}
