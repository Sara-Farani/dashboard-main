// ------------------------------------------------------------------
// Deposit-transaction label helper
// ------------------------------------------------------------------

export type TransactionType = 'deposit' | 'withdraw' | 'transfer'

export const getFaStatus: Record<TransactionType, string> = {
  deposit: 'واریز',
  withdraw: 'برداشت',
  transfer: 'انتقال',
}

export const getFaStatusColor: Record<TransactionType, 'success' | 'danger' | 'warning'> = {
  deposit: 'success',
  withdraw: 'danger',
  transfer: 'warning',
}