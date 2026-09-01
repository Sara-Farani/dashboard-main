// ------------------------------------------------------------------
// Transaction types
// ------------------------------------------------------------------

export type TransactionStatus = 'deposit' | 'transfer' | 'withdraw'

export interface TransactionEntry {
  id: string
  amount: number
  status: TransactionStatus
  timestamp: string
}

export type TransactionsByMinute = Record<string, number>

export interface TimeSeriesPoint {
  time: string
  count: number
}

export interface TxSummary {
  count: number
  maxPerMinute: number
  avgPerMinute: number
}